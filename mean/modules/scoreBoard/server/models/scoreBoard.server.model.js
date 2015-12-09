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
  teamName: {
    type: String
  },
  // 'challengeId': '{'users': {'userId': 'contrib'}, 'date': ISODate}'
  solved: [{
    challengeId:{
      type: Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    userId:{
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    date:{
      type: Date,
      default: Date.now
    },
    points:{
      type: Number
    }
  }],
  score: {
    type: Number,
    default: 0
  }
});

mongoose.model('ScoreBoard', ScoreBoardSchema);
