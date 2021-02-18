const axios = require('axios');
const config = require('../client/src/config.json');

module.exports = getPortalId = async (apiKey, portalUrl) => {
   let portalId;
   portalId = await axios({
      method: 'GET',
      baseURL: config.apiUrl + '/portals',
      params: { url: portalUrl },
      headers: { Authorization: apiKey }
   })
      .then(data => {
         if (data) {
            portalId = data.data.items[0].id
            return (portalId)
         }
      })
      .catch(error => {
         return (error)
      })
   return (portalId)
}
