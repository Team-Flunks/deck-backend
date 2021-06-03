'use strict'

//===============Importing and setting up===============
//Loading in Libraries
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
require('dotenv').config();

//App setup
const express = require ('express');
const app = express();
app.use(cors());
app.use(express.json());

//Created files
const UserInfo = require('./models/UserInfo.js');
const UserDatabase = require('./modules/UserDatabase.js');
const pokeInfoRequest = require('./modules/PokeAPI.js');
const getBooleanFacts = require('./modules/KnowledgeAPI.js');
const rewardRequestQuote = require('./modules/RewardQuote.js');
const rewardRequestImage = require('./modules/RewardImage.js');

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
          const TestUser = new UserInfo.UserModel({ email: 'chaboffe@gmail.com', gameRecords: [firstGame, secondGame], tokenCount: 9001 });
          TestUser.save();
          
        }
      });

    console.log('API server running :::' + process.env.PORT);
  });
});

//===============ROUTING AREA===============

//Refer to Modules/PokeAPI for info on what is happening here
app.get('/pokeInfo', pokeInfoRequest);

//Refer to Modules/UserDatabase for info on what is happening here
app.get('/singleUser', UserDatabase.singleUser);

//Refer to Modules/UserDatabase for info on what is happening here
app.get('/allUsers', UserDatabase.allUsers);

//Refer to Modules/UserDatabase for info on what is happening here
app.put('/updateUser', UserDatabase.updateUser);

//Refer to Modules/Knowledge for info on what is happening here
app.get('/knowledgegame', getBooleanFacts);

//Refer to Modules/RewardQuote for info on what is happening here
app.get('/rewardRequestQuote', rewardRequestQuote);

//Refer to Modules/RewardImage for info on what is happening here
app.get('/rewardRequestImage', rewardRequestImage);