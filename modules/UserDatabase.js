'use strict'

//=============== Setup ===============
const verifyToken = require('./verification.js');
const axios = require('axios');
const UserInfo=require('../models/UserInfo.js');
const UserModel = require('../models/UserInfo.js');

//=============== Request Logic ===============

//Setting up the export object
let UserDatabase = {};

//Grabbing full database entry for the user that sent the request
UserDatabase.singleUser = async function (req, res) {
  
  // Grab and verify token
  const token = req.headers.authorization.split(' ')[1];
  verifyToken(token, singleUserData);

  //Callback function to be plugged into Auth0 function above
  async function singleUserData(user) {

    //Find the stored info of the user
    let Users = await UserInfo.UserModel.find({ email: user.email });

    //if the user isn't in DB yet return empty array
    if (!Users.length) {
      res.send([]);
    }

    //Send the data out
    res.status(200).send(Users[0]);
  }
};

//Grabbing full database entry for all user in the database
UserDatabase.allUsers = async function (req, res) {
  
  // Grab and verify token
  const token = req.headers.authorization.split(' ')[1];
  verifyToken(token, allUserData);

  //Callback function to be plugged into Auth0 function above
  async function allUserData(user) {

    //Find the stored info of the user
    let Users = await UserInfo.UserModel.find({ });

    //if no users in the DB yet return empty array
    if (!Users.length) {
      console.log("Server Side All User Pull Found Nothing")
      res.send([]);
    }

    //Send the data out
    res.status(200).send(Users);
  }
}

//Adding or updating game record for the current user
UserDatabase.updateUser = async function (req, res){

  // Grab and verify token
  const token = req.headers.authorization.split(' ')[1];
  verifyToken(token, updateUserScore);

  //Callback function to be plugged into Auth0 function above
  async function updateUserScore(user) {

    //Pulling relevant information from the request
    const gameIn = req.query.game
    const didWinIn = req.query.didWin;
    const scoreIn = parseInt(req.query.score);
    const emailIn = user.email;

    //Find the user that sent the request in the database
    await UserInfo.UserModel.find({ email: emailIn }, (err, person) => {
      if (err) console.log(err);

      //If the user has no database entry add them into the database
      if(person.length == 0) {
        const newUser = new UserInfo.UserModel ({
          email: emailIn,
          tokenCount: 0
        });
        person.push(newUser);
      }
      
      // For loop to check if person has an existing gameRecord that matches the info coming in
      let tempIndex = -1;
      for( let g = 0; g < person[0].gameRecords.length; g ++) {
        if(person[0].gameRecords[g].game === gameIn) {
          tempIndex = g;
        }
      }
      
      //Logic for creating new gameRecord or modifying existing one
      if(tempIndex > -1){
        // If tempIndex was changed and indicating this gameRecord exists
        
        // Setting newTimesWon to increase if didWin is true 
        let newTimesWon = person[0].gameRecords[tempIndex].timesWon;
        let tokenNew = person[0].tokenCount;
        if(didWinIn){
          newTimesWon ++;
          tokenNew ++;
        }

        // Setting scoreIn to change to new high score if it greater than the previous high score
        let newHighScore = person[0].gameRecords[tempIndex].highscore;
        if(scoreIn > newHighScore) {
          newHighScore = scoreIn;
        }

        // This portion is putting back into the gameRecord the new values
        person[0].gameRecords[tempIndex].timesPlayed = person[0].gameRecords[tempIndex].timesPlayed + 1;
        person[0].gameRecords[tempIndex].timesWon = newTimesWon;
        person[0].gameRecords[tempIndex].highscore = newHighScore;
        person[0].tokenCount = tokenNew;

      } else {
        // If tempIndex was not changed indicating this gameRecord doesn't exists create new gameRecord

        // Setting newTimesWon to increase if did win game 
        let newTimesWon = 0;
        let tokenNew = person[0].tokenCount;
        if(didWinIn){
          newTimesWon ++;
          tokenNew ++;
        }

        // Making new game record
        const newGameRecord = new UserInfo.GameModel ({
          game: gameIn,
          timesPlayed: 1,
          timesWon: newTimesWon,
          highscore: scoreIn
        });

        //adding new gameRecord to the user for saving
        person[0].gameRecords.push(newGameRecord);
        person[0].tokenCount = tokenNew;
      }

      //Save updated/new gameRecord to database and send info back to client
      person[0].save();
      res.status(200).send(person[0].gameRecords);
    })
  }
}

module.exports = UserDatabase;