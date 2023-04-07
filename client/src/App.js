import React, { Component } from 'react';
import Iframe from 'react-iframe';
import axios from 'axios';
import config from './config';
import './App.css';

const { apiKey, apiUrl, portalReferrer, userEmail, portalUrl } = config;
const baseUrl = apiUrl;

class App extends Component {
  state = {
    buildDate: '',
    portalUrl: '',
    portalId: '',
    targetPortalUrl: '',
    packageId: '',
    userEmail: '',
    validitySeconds: 600,
    destinationPath: '',
    packageEvents: [],
    packageFiles: [],
    redeemed: false,
    monitor: true,
    direction: ''
  }

  componentDidMount() {
    const buildDate = new Date().toISOString()
    this.setState(
      {
        userEmail,
        buildDate,
        portalUrl
      })
    setInterval(this.updateEvents, 2500)
  }

  handleInput = event => {
    let { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  initUpload = (event) => {
    event.preventDefault();
    this.setState({
      direction: 'upload',
      packageEvents: [],
      packageFiles: []
    })
    this.loadPortal()
  }

  initDelivery = (event) => {
    event.preventDefault();
    this.setState({
      direction: 'download',
      packageEvents: [],
    })
    this.loadPortal()
  }

  loadPortal = () => {
    this.setState({
      portalId: '',
      targetPortalUrl: '',
      packageId: ''
    })
    this.getPortalId();
  }

  getPortalId = () => {
    axios({
      method: 'GET',
      baseURL: baseUrl + '/portals',
      params: { url: this.state.portalUrl },
      headers: { Authorization: apiKey }
    })
      .then(res => {
        this.setState({ portalId: res.data.items[0].id }, () => {
          this.createPackage()
        });
      })
      .catch(err => {
      })
  }

  createPackage = () => {
    axios({
      method: 'POST',
      url: baseUrl + '/portals/' + this.state.portalId + '/packages',
      headers: { Authorization: apiKey },
      data: {
        metadata: {
          reference: 'Scott',
          portalId: this.state.portalId
        }
      }
    })
      .then(res => {
        this.setState({ packageId: res.data.id }, () => {
            if (this.state.direction === 'download') {
                this.deliverFiles()
            } else {
                this.requestFiles()
            }
        });
      })
      .catch(err => {})
  }

  requestFiles = () => {
    let expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + this.state.validitySeconds)
    axios({
      method: 'POST',
      url: baseUrl + '/portals/' + this.state.portalId + '/packages/' + this.state.packageId + '/tokens',
      headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
      data: {
        user: { email: this.state.userEmail },
        grants: ['upload'],
        expiresOn: expiration.toISOString(),
        destinationPath: this.state.userEmail,
        notifications: [
          {
            type: 'webhook',
            url: 'https://' + portalReferrer + '/api/redemption/' + this.state.packageId
          }
        ]
      }
    })
      .then(res => {
        this.setState({ targetPortalUrl: res.data.url })
      })
      .catch(err => {
      })
  }

  deliverFiles = () => {
    let expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + this.state.validitySeconds)
    axios({
      method: 'PUT',
      url: baseUrl + '/portals/' + this.state.portalId + '/packages/' + this.state.packageId + '/files',
      headers: { 'Authorization': apiKey },
      data: {
        files: this.state.packageFiles
      }
    })
      .then(res => {
        axios({
          method: 'POST',
          url: baseUrl + '/portals/' + this.state.portalId + '/packages/' + this.state.packageId + '/tokens',
          headers: { 'Authorization': apiKey, 'Content-Type': 'application/json' },
          data: {
            user: { email: this.state.userEmail },
            grants: ['download'],
            expiresOn: expiration.toISOString(),
            notifications: [
              {
                type: 'webhook',
                url: 'https://' + portalReferrer + '/api/redemption/' + this.state.packageId
              }
            ]
          }
        })
          .then(res => {
            this.setState({
              targetPortalUrl: res.data.url,
              packageFiles: [],
              direction: []
            })
          })
          .catch(err => {
          })
      })
      .catch(err => {
      })
  }

  updateEvents = () => {
    if (this.state.targetPortalUrl && this.state.monitor) {
      axios({
        method: 'GET',
        url: baseUrl + '/portals/' + this.state.portalId + '/packages/' + this.state.packageId + '/events',
        headers: { 'Authorization': apiKey },
      })
        .then(res => {
          this.setState({
            packageEvents: res.data.items
          });
          if (this.state.packageEvents[0].action === "Successful Upload" || this.state.packageEvents[0].action === "Successful Download") {
            this.showFiles()
          }
        })
        .catch(err => {
        })
    }
  }

  showFiles = () => {
    axios({
      method: 'GET',
      url: baseUrl + '/portals/' + this.state.portalId + '/packages/' + this.state.packageId + '/files',
      headers: { 'Authorization': apiKey },
    })
      .then(res => {
        this.setState({
          packageFiles: res.data.files,
          portalId: '',
          targetPortalUrl: '',
          packageId: ''
        });
      })
      .catch(err => {
      })
  }

  toggleMonitor = () => {
    if (this.state.monitor) {
      this.setState({ monitor: false })
    } else
      this.setState({ monitor: true })
  }

  render() {
    return (
      <div className="flex-container">
        <div className="container-fluid-nav text-light navbar-light bg-dark mx-auto text-center py-3 mb-3">
          <h3>Media Shuttle System 2 Person API</h3>
          <h6>Build Date/Time: <strong>{this.state.buildDate}</strong></h6>
        </div>
        <div className="row mx-2">
          <div className="col-8" id="app">
            <h4 className='text-center'>Simulating your MAM calling MS API</h4>
            <p>This application demonstrates the use of the token endpoint allowing MS URL's to be generated for upload or download events. The URL opens in the browser once generated such as within a MAM. Use the default values or enter an API key and portal URL with <strong>Embedded Portals</strong> set to {portalReferrer}</p>
            <form>
              <div className="row mx-2">
                <div className="col-4">
                  <div className="form-group">
                    <label>Developer API Key</label>
                    <input className="form-control"
                      type="password"
                      name="apiKey"
                      value={apiKey}
                      placeholder="Enter your API Key"
                      onChange={this.handleInput} />
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label>Portal Url</label>
                    <input className="form-control"
                      type="text"
                      name="portalUrl"
                      value={this.state.portalUrl}
                      placeholder="Portal Url"
                      onChange={this.handleInput} />
                  </div>
                </div>
                <div className="col-4">
                  <div className="form-group">
                    <label>User email</label>
                    <input className="form-control"
                      type="text"
                      name="userEmail"
                      value={this.state.userEmail}
                      placeholder="User email"
                      onChange={this.handleInput} />
                  </div>
                </div>
              </div>
              <div className="row mx-2">
                <div className="col-12">
                <div className="mb-2 d-flex justify-content-around">
                  <button type="button" className="btn btn-secondary" onClick={this.initUpload}>Request Files</button>
                
                  {this.state.packageFiles.length ?
                  <button type="button" className="btn btn-secondary" onClick={this.initDelivery}>Deliver the Files</button>
                  :
                  ''
                  }
                </div>
                {this.state.monitor ? (
                        <button type="button" className="btn btn-secondary align-content-center mx-auto text-center d-block my-2" onClick={this.toggleMonitor}>Stop Event Monitoring</button>
                      ) :
                        <button type="button" className="btn btn-secondary align-content-center mx-auto text-center d-block my-2" onClick={this.toggleMonitor}>Start Event Monitoring</button>
                      }
                  {this.state.portalId ?
                    <div>
                      <div className="form-group" >
                        <label>Find Portal ID GET {baseUrl}/portals?url={this.state.portalUrl}</label>
                        <input readOnly={true} className="form-control"
                          type="text"
                          name="portalId"
                          value={this.state.portalId}
                          placeholder="my-portal-name" />
                      </div>
                    </div>
                    : null
                  }
                  {this.state.packageId ?
                    <div>
                      <div className="form-group" >
                        <label>Create Package POST {baseUrl}/portals/{this.state.portalId}/packages</label>
                        <input readOnly={true} className="form-control"
                          type="text"
                          name="portalId"
                          value={this.state.packageId}
                          placeholder="" />
                      </div>
                    </div>
                    : null
                  }
                  {this.state.targetPortalUrl ?
                    <div>
                      <div className="form-group" >
                        <label>Create Delivery URL POST {baseUrl}/portals/{this.state.portalId}/packages/{this.state.packageId}/tokens</label>
                        <input readOnly={true} className="form-control"
                          type="text"
                          name="portalId"
                          value={this.state.targetPortalUrl}
                          placeholder="" />
                      </div>
                      <a href={this.state.targetPortalUrl} target='_new'>Open link in new window</a>
                      
                    </div>
                    : null
                  }
                  {this.state.packageFiles.length && this.state.direction === 'upload' ? (
                    <div>
                      <br />
                      {this.state.packageFiles.map((file, idx) => (
                        <h6 key={idx}>File: {file.path}</h6>
                      ))
                      }
                    </div>
                  )
                    : ''
                  }
                  {this.state.packageEvents.length ? (
                    <div>
                      {this.state.packageEvents.map((item, idx) => (
                        <h6 key={idx}>Event: {item.action}</h6>
                      ))
                      }
                    </div>
                  )
                    : ''
                  }
                </div>
              </div>
            </form>
          </div>
          <div className="col-4" id="shuttle">
            <div className="mx-auto">
              <h4 className='text-center'>Embedded MS Portal UI</h4>
              {this.state.targetPortalUrl ?
                <Iframe
                  url={this.state.targetPortalUrl}
                  width="375"
                  height="450"
                  id="embedded-iframe"
                  display='flex'
                  position='unset'
                />
                :
                <div id="pending">
                  <p className='text-center'>Pending Delivery Token</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
