const axios = require('axios');
const config = require('../client/src/config.json');

module.exports = createPackage = async (apiKey, portalId) => {
   let packageId;
   packageId = await axios({
      method: 'POST',
      baseURL: config.apiUrl + '/portals/',
      url: portalId + '/packages',
      headers: { Authorization: apiKey }
   })
      .then(data => {
         packageId = data.data.id
         return (packageId)
      })
      .catch(error => {
         return (error.response.data)
      })
   return (packageId)
}
