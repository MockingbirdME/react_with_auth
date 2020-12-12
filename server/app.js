require('dotenv').config();

const express = require('express');
const path = require("path");
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');

const app = express();
const port = process.env.PORT || 5000;


// Parse queries and parameters.
const PAYLOAD_LIMIT = '5mb';
app.use(express.json({limit: PAYLOAD_LIMIT}));
app.use(express.urlencoded({extended: false, limit: PAYLOAD_LIMIT}));

// Load the Okta private variaibles. NOTE: This will not work in production, update it to load the properties correctly there.
const {ISSUER, CLIENT_ID, CLIENT_SECRET} = process.env;

const oidc = new ExpressOIDC({
  issuer: ISSUER,
  client_id: CLIENT_ID,
  client_secret: CLIENT_SECRET,
  appBaseUrl: 'http://localhost:5000',
  scope: 'openid profile'
});

app.use(session({
  secret: 'this-should-be-very-random',
  resave: true,
  saveUninitialized: false
}));

app.use(oidc.router);

// Require users be authenticated to get to the rest of the app.
app.use(oidc.ensureAuthenticated());

// Revoke any known Okta access/refresh tokens, then redirect to the Okta logout endpoint which then redirects back to a callback url for logout specified in your Okta settings.
app.get('/logout', oidc.forceLogoutAndRevoke(), (req, res) => {
  // This is never called because forceLogoutAndRevoke always redirects.
});

// Wait for OICD to be ready before the app listens on its set port.
oidc.on('ready', () => {
  app.listen(port, () => console.log('app started'));
});

// Handle errors that occurr while setting up OIDC, during token revokation, or during post-logout handling
oidc.on('error', err => {
  console.error('Got an error with OIDC.');
  console.error(err);
});

// Create a GET route  TODO get rid of this once proper api is set up.
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});

app.use(express.static("client/build", {index: false}));

// For any other request, let React handle it.
app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});
