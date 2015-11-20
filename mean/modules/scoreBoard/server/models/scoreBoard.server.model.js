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
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    require: 'Non-sensical otherwise.'
  },
  // 'challengeId': '{'users': {'userId': 'contrib'}, 'date': ISODate}'
  solved: [{
    type: Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  score: {
    type: Number
  }
});

mongoose.model('ScoreBoard', ScoreBoardSchema);
