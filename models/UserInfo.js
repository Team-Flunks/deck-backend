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

//=============== Reward Quote Schema ===============
const QuoteSchema = new mongoose.Schema({
  quote: { type: String, required: true },
  author: { type: String }
});

const QuoteModel = mongoose.model('Quotes', QuoteSchema);

//=============== Reward Image Schema ===============
const ImageSchema = new mongoose.Schema({
  imageSrc: { type: String, required: true }
});

const ImageModel = mongoose.model('Images', ImageSchema);

//=============== User Schema ===============
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  gameRecords: [GameSchema],
  tokenCount: { type: Number },
  rewardQuotes: [QuoteSchema],
  rewardImages: [ImageSchema]
});

const UserModel = mongoose.model('Players', UserSchema);

//=============== Exports ===============
module.exports = { UserModel, GameModel, QuoteModel, ImageModel };
