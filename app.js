const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Receive webhook from react web app and show package json
app.post('/api/redemption/:packageId', (req, res) => {
  const redemption = {
    packageId: req.params.packageId,
    body: req.body,
    status: 'ok',
    code: 200,
  };
  console.log('Package redempetion body', redemption)
  res.sendStatus(200);
});

// Catch all handler. Show index.html

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const handleUnexpectedError = (err, req, res, next) => {
  console.log('Unexpected error: ' + JSON.stringify(err));
  res.json({status: 500});
}
app.use(handleUnexpectedError);

module.exports = app;

