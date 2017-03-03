'use strict'

var path = require('path')
var mongoose = require('mongoose')
var Challenge = mongoose.model('Challenge')
var Q = require('q')
var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'))

exports.read = function (req, res) {
  res.json(req.challenge)
}

exports.default = function (req, res, next) {
  req.challenge = new Challenge({
    'challengeType': 'text',
    'challengeFormat': 'short-answer',
    'points': 10,
    'answers': []
  })
  exports.read(req, res, next)
}

exports.updateOrCreate = function (req, res) {
  var challenge = req.challenge ? req.challenge : new Challenge({})
  if (!req.challenge) {
    challenge.createdBy = req.user._id
  }
  challenge.lastModifiedBy = req.user._id
  challenge.lastModified = Date.now()
  challenge.name = req.body.name
  challenge.description = req.body.description
  challenge.category = req.body.category
  challenge.points = req.body.points
  challenge.answers = req.body.answers
  challenge.challengeType = req.body.challengeType
  challenge.challengeFormat = req.body.challengeFormat
  challenge.affectedMachine = req.body.affectedMachine
  challenge.numberOfSubmissions = req.body.numberOfSubmissions
  challenge.niceCategories = req.body.niceCategories

  challenge.save(function (err) {
    if (err) {
      console.log(err)
      res.send({ success: false, error: err })
    } else {
      res.send({ success: true })
    }
  })
}

exports.delete = function (req, res) {
  var challenge = req.challenge
  challenge.remove(function (err) {
    if (err) {
      console.log(err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.json(challenge)
    }
  })
}

exports.list = function (req, res) {
  Challenge.find().select('-flags').sort('-created').exec(function (err, challenges) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      })
    } else {
      res.json(challenges)
    }
  })
}

exports.challengeByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Challenge is invalid'
    })
  }
  getChallengeById(id).then(function (challenge) {
    req.challenge = challenge
    next()
  }, function (err) {
    if (err.number === 404) {
      res.status(404).send(err.message)
    } else {
      res.status(500)
    }
    next(err)
  }).finally(function (err) {
    console.log(err)
  })
}

function getChallengeById (id) {
  var deferred = Q.defer()
  Challenge.findById(id).exec(function (err, challenge) {
    if (err) {
      deferred.reject(err)
    } else if (!challenge) {
      var error = new Error('No challenges with that identifier were found')
      error.number = 404
      deferred.reject(error)
    } else {
      deferred.resolve(challenge)
    }
  })
  return deferred.promise
}
