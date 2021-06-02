'use strict';

//=============== Setup ===============
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

//===============jwt verification stuff===============

//All taken from the documentation of Auth0

const client = jwksClient({
  jwksUri: 'https://keian-auth.us.auth0.com/.well-known/jwks.json',
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

function verifyToken(token, callback) {
  jwt.verify(token, getKey, {}, (err, user) => {
    if (err) {
      console.error('Something went wrong');
      return callback(err);
    }
    callback(user);
  });
}


module.exports = verifyToken;
