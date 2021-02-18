const axios = require('axios');
const config = require('../client/src/config.json');

module.exports = deliverFiles = async (apiKey, portalId, packageId, userEmail, expiration, webhook) => {
   let webToken;
   let options = {
      method: 'POST',
      baseURL: config.apiUrl + '/portals/',
      url: portalId + '/packages/' + packageId + '/tokens',
      headers: { Authorization: apiKey },
      data: {
         user: { email: userEmail },
         grants: [
            'download'
         ],
         expiresOn: expiration,
         destinationPath: '/path',
         notifications: [
            {
               type: 'webhook',
               url: webhook
            }
         ]
      }
   }

   webToken = await axios(options)
      .then(data => {
         webToken = data.data.url
         return (webToken)
      })
      .catch(data => {
         return (data.response.data)
      })
   return(webToken)
}
