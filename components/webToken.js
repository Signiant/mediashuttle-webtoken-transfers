const axios = require('axios');
const config = require('../client/src/config.json');

module.exports = webToken = async (apiKey, portalId, packageId, userEmail, grants, expiration, webhook) => {
   let webToken;
   let options = {
      method: 'POST',
      baseURL: config.apiUrl + '/portals/',
      url: portalId + '/packages/' + packageId + '/tokens',
      headers: { Authorization: apiKey },
      data: {
         user: { email: userEmail },
         expiresOn: expiration,
         destinationPath: '/path',
         grants: grants,
         notifications: [
            {
               type: 'webhook',
               url: webhook
            }
         ]
      }
   }
   // if (direction === 'upload') {
   //    options.data.grants = [ 'upload' ]
   // } else {
   //    options.data.grants = [ 'download' ]
   // }

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
