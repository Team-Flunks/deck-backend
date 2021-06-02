'use strict';

//=============== Setup ===============
const mongoose = require('mongoose');

//=============== Game Schema ===============
const GameSchema = new mongoose.Schema({
  game: { type: String, required: true },
  timesPlayed: { type: Number },
  timesWon: { type: Number },
  highscore: { type: Number }
});

const GameModel = mongoose.model('Games', GameSchema);

//=============== User Schema ===============
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  gameRecords: [GameSchema],
  tokenCount: { type: Number }
});

const UserModel = mongoose.model('Players', UserSchema);

//=============== Exports ===============
module.exports = { UserModel, GameModel };
