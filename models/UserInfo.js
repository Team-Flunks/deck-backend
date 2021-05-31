'use strict';

const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  game: {type: String, required: true},
  timesPlayed: {type: Number},
  timesWon: {type: Number},
  timesLost: {type: Number},
  highscore:{type: Number}
});
const GameModel = mongoose.model('Games', GameSchema);

const UserSchema = new mongoose.Schema({
  email: {type: String, required:true},
  gameRecords: [GameSchema]
});

const UserModel = mongoose.model('Players', UserSchema);

module.exports = {UserModel, GameModel};
