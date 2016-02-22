'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Challenge Schema
 */
var ChallengeSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    createdBy : {
        type : String,
        required : "Challenge must have a creator specified"
    },
    lastModifiedBy :{
        type : String,
        required : "Challenge must have last modified by user specified"
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: 'Challenge must have a name',
        trim: true
    },
    description : {
        type : String,
        required: "Challenge must have a question",
        trim : true
    },
    category: [{
        type: String,
        required: 'Challenge must belong to a category',
        trim: true
    }],
    points: {
        type: Number,
        min: 0,
        required: 'Challenge points must be set'
    },
    files : [{
        type : String,
        trim : true
    }],
    challenge_type : {
        type : String,
        required: "Each challege must be of the list of available challenge formats.",
        enum: ['choice', 'text']
    },
    challenge_format : {
        type : String,
        required : "Each answer must have a format.",
        enum: ['true-false', 'select', 'multi-select', 'short-answer', 'long-answer'],
    },
    answers : [{
        value : {
            type        : String,
            required    : "Challenge answer must have a value.",
            trim        : true,
                  },
        isRegex : {
            type        : Boolean,
            default     : false,
        },
        isCorrect : {
            type        : Boolean,
            default     : false,
        }
    }],
});

mongoose.model('Challenge', ChallengeSchema);
