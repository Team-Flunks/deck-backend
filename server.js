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
// const GameModel=require('./models/UserInfo.js');
// const UserModel=require('./models/UserInfo.js');

const verifyToken=require('./modules/verification.js');

// const GameUser=require('./modules/server2.js');

//===============jwt verification stuff===============

// const client = jwksClient({
//   //Might need to change depending on Auth0 weirdness
//   jwksUri: 'https://keian-auth.us.auth0.com/.well-known/jwks.json',
// });


// function getKey(header, callback) {
//   client.getSigningKey(header.kid, function (err, key) {
//     const signingKey = key.publicKey || key.rsaPublicKey;
//     callback(null, signingKey);
//   });
// }

// function verifyToken(token, callback) {
//   jwt.verify(token, getKey, {}, (err, user) => {
//     if (err) {
//       console.error('Something went wrong');
//       return callback(err);
//     }
//     callback(user);
//   })
// }

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
          const firstGame = new UserInfo.GameModel({
            game: 'Test Knowledge Big Brain Time',
            timesPlayed: 3,
            timesWon: 2,
            timesLost: 1,
            highscore: 7
          });
          const secondGame = new UserInfo.GameModel({
            game: 'Which Pokemon Though',
            timesPlayed: 5,
            timesWon: 2,
            timesLost: 3,
            highscore: 4
          });
          const TestUser = new UserInfo.UserModel({ email: 'chaboffe@gmail.com', gameRecords: [firstGame, secondGame] });
          TestUser.save();
          
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
    console.log("Server Side return of Single User Pull");
    console.log(Users[0]);
    //if the user isn't in DB yet maybe create a new user with the info passed in here
    if (!Users.length) {
      console.log("Server Side Single User Pull Found Nothing");
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
  verifyToken(token, allUserData);

  //Find stored data of verified user
  //Pass it into verifyToken so we can use Auth0 things inside this function
  async function allUserData(user) {
    //Legacy variable names, edit here
    let Users = await UserInfo.UserModel.find({ });
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


app.put('/updateUser', (request,response) => {
  console.log(request.params, request.query)
  const token = request.headers.authorization.split(' ')[1];
  console.log(token);
  verifyToken(token, updateUserScore);

  // Callback function
  // Game: {type: String, required: true},
  // timesPlayed: {type: Number},
  // timesWon: {type: Number},
  // timesLost: {type: Number},
  // highscore:{type: Number}

  async function updateUserScore(user) {
    const gameIn = request.query.game
    const timesPlayedIn = parseInt(request.query.timesPlayed);
    const timesWonIn = parseInt(request.query.timesWon);
    const timesLostIn = parseInt(request.query.timesLost);
    const highscoreIn = parseInt(request.query.highscore);
    const emailIn = user.email;


    await UserModel.find({ emailIn }, (err, person) => {
      if (err) console.log(err);

      if(person.length == 0) {
        const newUser = new UserInfo.UserModel ({
          email: {emailIn}
        })
        person.push(newUser);
      }

      // Assuming input data is updated with Old Record Data
      const newGameRecord = new UserInfo.GameModel ({
        Game: {gameIn},
        timesPlayed: {timesPlayedIn},
        timesWon: {timesWonIn},
        timesLost: {timesLostIn},
        highscore:{highscoreIn}
      })

      // For loop to check if person has played and seeing if record matches this data
      let tempIndex = -1;
      for( let g = 0; g < person[0].gameRecords.length; g ++) {
        if(person[0].gameRecords[g].game === gameIn) {
          tempIndex = g;
        }
      }

      // If the game isn't new brining in newGameRecord and plugging in different data
      if(tempIndex > -1){
        person[0].gameRecords[tempIndex] = newGameRecord;
      } else {
        person[0].gameRecords.push(newGameRecord);
      }
      person[0].save();

      response.send(person[0].gameRecords);
    })
  }
});



