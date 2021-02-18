# Media Shuttle System 2 Person Automation API Sample Code
### Scott Reynolds, Solution Consultant, Signiant Inc. 
### Nov 21 2019 v1.0.0

This application demonstrates how to create Media Shuttle transfer web tokens using front and back-end samples. The applicaton components will work locally but should be hosted in an external environment so the a public URL can be used as the Trusted Referred and for iFrame embedding of the Media Shuttle transfer app to appear. There is also a link generated which does not require embedding.

## client/src/config.json

The config is shared between the front and backend and contains your API key and other parameters required to create a web token. Your API key can be obtained from your Media Shuttle IT Admin console at https://manage.mediashuttle.com as referenced in our developer help at https://developer.signiant.com

## /workflows

Contains generateWebToken.js that will create a MS web token based on the parameters of the config.json file. Run on the command line.

>node workflows/generateWebToken.js

## /components

Contains individual scripts for each of the Media Shuttle API endpoints. generateWebToken uses these components to create the token. apiUrl is also loaded from config.json. 

## /client React App

The React App can be deployed using:

> npm run setup

> npm run start-dev

The web app contains a MAM backend interface on the left and end user embedded window on the right. Use the default values or enter an API key and *yourportal*.mediashuttle.com for a portal with *Trusted Referrers* set to the url of your host application URL. These setting can also be changed in the client/src/config.json

This application also serves as a webhook endpoint for receiving notification from the transfer event. Once files have been uploaded the application can then allow a download event using the same file list.
