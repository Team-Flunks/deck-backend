'use strict';

const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  Game: {type: String, required: true},
  timesPlayed: {type: Number},
  timesWon: {type: Number},
  timesLost: {type: Number},
  highscore:{type: String}
})

const UserSchema = new mongoose.Schema({
  email: {type: String, required:true},
  gameInfo: [GameSchema]
})

const UserModel = mongoose.model('Players', UserSchema);

module.exports = UserModel