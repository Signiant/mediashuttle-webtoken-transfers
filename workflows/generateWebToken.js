const mediaShuttle = require('../components');

// this module will a test function by default
// edit test invocation from config.json import below

const generateWebToken = async (apiKey, portalUrl, userEmail, grants, expiration, path, files, webhook) => {

   let response = {
      portalUrl,
      userEmail,
      grants,
      expiration,
      webhook
   }
   
   if (!userEmail) { 
      console.log('error: userEmail required')
      return('error: userEmail required')
   }
   if (!path) {
      console.log('error: path required')
      return('error: path required')
   }
   if (!expiration ) {
      console.log('error: expiration required')
      return({error: 'expiration required'})
   }
   if (grants === ['download'] && !files) {
      console.log('error: file list required for download')
      return({error: 'file list required for download'})
   }
   
   let portalId = await mediaShuttle.getPortalId(apiKey, portalUrl)
   response.portalId = portalId;

   let packageId = await mediaShuttle.createPackage(apiKey, portalId)
   response.packageId = packageId;

   if (grants[0] === "download") {
      let addFilesResult = await mediaShuttle.addFiles(apiKey, portalId, packageId, files)
   }

   let webToken = await mediaShuttle.webToken(apiKey, portalId, packageId, userEmail, grants, expiration, webhook)
   response.webToken = webToken;
   return response
}

// Load the config

const { apiKey, portalUrl, userEmail, grants, expirationSeconds, path, files, webhook} = require('../client/src/config.json')

let expiration = new Date()
expiration.setSeconds(expiration.getSeconds() + expirationSeconds);

generateToken = async () => {
   let transferWebToken = await generateWebToken(
      apiKey, portalUrl, userEmail, grants, expiration, path, files, webhook
      )
   console.log('TransferWebToken Object', transferWebToken)  
}

// execute the function and return the token

generateToken();

module.exports = {
   generateWebToken
}
