'use strict'

//===============Importing and setting up===============
//Loading in Libraries
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const mongoose = require('mongoose');

//App setup
const express = require ('express');
const app = express();
app.use(cors());
app.use(express.json());

//Created files
const UserInfo=require('./models/UserInfo.js');

//===============jwt verification stuff===============

const client = jwksClient({
  //Might need to change depending on Auth0 weirdness
  jwksUri: 'https://thefourth.us.auth0.com/.well-known/jwks.json',
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
  })
}

//===============Mongoose database setup===============
console.log(process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

//When opening the database check if it is empty and add the hard coded values if so
db.once('open', function () {
  app.listen(process.env.PORT, () => {

    UserInfo.UserModel.find({})
      .then(results => {
        if (results.length === 0) {
          //Set initial values and save them into the DB
          //Might not need that in this project
        }
      });

    console.log('API server running :::' + process.env.PORT);
  });
});

//===============ROUTING AREA===============

// GET single user info
//Connection made via Auth0 email
app.get('/singleUser', (req, res) => {
  
  // Grab and verify token
  const token = req.headers.authorization.split(' ')[1];
  verifyToken(token, singleUserData);

  //Find stored data of verified user
  //Pass it into verifyToken so we can use Auth0 things inside this function
  async function singleUserData(user) {
    //Legacy variable names, edit here
    let Users = await UserInfo.UserModel.find({ email: user.email });
    console.log("Server Side return of Single User Pull")
    console.log(Users[0]);
    //if the user isn't in DB yet maybe create a new user with the info passed in here
    if (!Users.length) {
      console.log("Server Side Single User Pull Found Nothing")
      res.send([]);
    }
    //Send the data out
    res.send(Users[0]);
  }
});

// GET single user info
//Connection made via Auth0 email
app.get('/allUsers', (req, res) => {
  
  // Grab and verify token
  const token = req.headers.authorization.split(' ')[1];
  verifyToken(token, singleUserData);

  //Find stored data of verified user
  //Pass it into verifyToken so we can use Auth0 things inside this function
  async function allUserData(user) {
    //Legacy variable names, edit here
    let Users = await UserInfo.UserModel.find({ email: user.email });
    console.log("Server Side return of Single User Pull")
    console.log(Users);
    //if the user isn't in DB yet maybe create a new user with the info passed in here
    if (!Users.length) {
      console.log("Server Side All User Pull Found Nothing")
      res.send([]);
    }
    //Send the data out
    res.send(Users);
  }
});

