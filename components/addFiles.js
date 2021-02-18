const axios = require('axios');
const config = require('../client/src/config.json');

module.exports = addFiles = async (apiKey, portalId, packageId, files) => {
   let result;
   result = await axios({
      method: 'PUT',
      baseURL: config.apiUrl + '/portals/',
      url: portalId + '/packages/' + packageId + '/files',
      headers: { Authorization: apiKey },
      data: { files }
   })
      .then(data => {
         result = data.data
         return (result)
      })
      .catch(error => {
         return (error.response.data)
      })
   return (result)
}
