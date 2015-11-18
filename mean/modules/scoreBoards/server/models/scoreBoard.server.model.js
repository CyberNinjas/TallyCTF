'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * ScoreBoard Schema
 */
var ScoreBoardSchema = new Schema({
  teamId: {
    type: String,
    require: 'Non-sensical otherwise.'
  },
  // 'challengeId': '{'users': {'userId': 'contrib'}, 'date': ISODate}'
  solved: {
    type: JSON
  },
  score: {
    type: Number
  }
});

mongoose.model('ScoreBoard', ScoreBoardSchema);
