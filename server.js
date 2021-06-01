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
const UserModel = require('./models/UserInfo.js');
const pokeInfoRequest = require('./modules/PokeAPI.js');
const verifyToken = require('./modules/verification.js');

const getBooleanFacts=require('./modules/KnowledgeAPI.js');


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
            highscore: 7
          });
          const secondGame = new UserInfo.GameModel({
            game: 'Which Pokemon Though',
            timesPlayed: 5,
            timesWon: 2,
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

//Refer to Modules/PokeAPI for info on what is happening here
app.get('/pokeInfo', pokeInfoRequest);

// GET single user info
//Connection made via Auth0 email
app.get('/singleUser', (req, res) => {
  
  // Grab and verify token
  console.log('This is the req information for single user');
  console.log(req.headers);
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
  console.log('Update User Information coming in from client side');
  console.log(request.params, request.query)

  const token = request.headers.authorization.split(' ')[1];
  verifyToken(token, updateUserScore);

 
  async function updateUserScore(user) {
    const gameIn = request.query.game
    const didWinIn = parseInt(request.query.didWin);
    const scoreIn = parseInt(request.query.score);
    const emailIn = user.email;


    await UserInfo.UserModel.find({ email: emailIn }, (err, person) => {
      if (err) console.log(err);
      if(person.length == 0) {
        const newUser = new UserInfo.UserModel ({
          email: emailIn
        });
        person.push(newUser);
      }
      
      // For loop to check if person has played and seeing if record matches this data
      let tempIndex = -1;
      for( let g = 0; g < person[0].gameRecords.length; g ++) {
        if(person[0].gameRecords[g].game === gameIn) {
          tempIndex = g;
        }
      }
      
      // If the game isn't new brining in newGameRecord and plugging in different data
      if(tempIndex > -1){
        // This is where the logic for updating happens

        // Setting newTimesWon to increase if did win game 
        let newTimesWon = person[0].gameRecords[tempIndex].timesWon;
        if(didWinIn){
          // If does not increment then this is the reason
          newTimesWon ++;
        }

        // Setting scoreIn to change to new high score if it greater than the previous high score
        let newHighScore = person[0].gameRecords[tempIndex].highscore;
        if(scoreIn > newHighScore) {
          newHighScore = scoreIn;
        }

        // This portion is in relation to the update of the new values
        person[0].gameRecords[tempIndex].timesPlayed = person[0].gameRecords[tempIndex].timesPlayed + 1;
        person[0].gameRecords[tempIndex].timesWon = newTimesWon;
        person[0].gameRecords[tempIndex].highscore = newHighScore;
      } else {

        // Setting the record of a new game 
        // Setting newTimesWon to increase if did win game 
        let newTimesWon = 0;
        if(didWinIn){
          // If does not increment then this is the reason
          newTimesWon ++;
        }
        // Making new game record
        const newGameRecord = new UserInfo.GameModel ({
          game: gameIn,
          timesPlayed: 1,
          timesWon: newTimesWon,
          highscore: scoreIn
        });
        person[0].gameRecords.push(newGameRecord);
      }
      person[0].save();

      // Might need to change response.send back if front end wants different info
      response.send(person[0].gameRecords);
    })
  }
});


// Specific route for knowledge game with function
app.get('/knowledgegame', getBooleanFacts);



