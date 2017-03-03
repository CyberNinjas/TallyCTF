'use strict';
/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  CtfEvent = mongoose.model('CtfEvent'),
  Challenge = mongoose.model('Challenge'),
  Team = mongoose.model('Team'),
  User = mongoose.model('User'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

exports.create = function (req, res) {
  var ctfEvent = new CtfEvent(req.body);
  ctfEvent.save(function (err) {
    if (err) {
      console.log(err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvent);
    }
  });
};

/**
 * Gets the requested event object and passes back only the white-listed elements
 * Most notably we remove the answers entirely from text based questions and
 * we remove their designation of correctness from multiple-choice questions.
 */
exports.read = function (req, res) {
  var teams = []

  for (var team = 0; team < req.ctfEvent.teams.length; ++team) {
    teams.push({ team: req.ctfEvent.teams[team].team, _id: req.ctfEvent.teams[team]._id, score: 0 })
  }

  for (var challenge = 0; challenge < req.ctfEvent.challenges.length; ++challenge) {
    var currentChallenge = req.ctfEvent.challenges[challenge]
    var scorers = []

    for (var submission = 0; submission < currentChallenge.submissions.length; ++submission) {
      var currentSubmission = currentChallenge.submissions[submission];
      if (currentChallenge.challengeType === 'text') {
        scorers = scoreText(currentChallenge, currentSubmission, scorers)

      } else if(currentChallenge.challengeType === 'choice'){
        scorers = scoreChoice(currentChallenge, currentSubmission, scorers)
      }
    }

    if(scorers.length > 0){
      for (var teamIndex = 0; teamIndex < teams.length; ++teamIndex) {
        if (scorers.indexOf(String(teams[teamIndex]._id)) > -1) {
          teams[teamIndex].score += currentChallenge.points
        }
      }
    }
    currentChallenge.scorers = scorers
  }

  for (var index = 0; index < req.ctfEvent.challenges.length; ++index) {
    var challenge = req.ctfEvent.challenges[index]
    var answerValues = undefined
    if (challenge.challengeType === 'choice') {
      var answerValues = []
      var answers = challenge.answers
      for (var idx = 0; idx < answers.length; ++idx) {
        answerValues.push({ value: answers[idx].value })
      }
    }

    if(req.ctfEvent.submissions){
      for (var index = 0; index < req.ctfEvent.challenges.submissions.length; ++index) {
        req.ctfEvent.challenges.submissions[index].answer = ''
      }
    }

    req.ctfEvent.challenges[index] = {
      _id: challenge._id,
      category: challenge.category,
      points: challenge.points,
      name: challenge.name,
      challengeType: challenge.challengeType,
      challengeFormat: challenge.challengeFormat,
      description: challenge.description,
      submissions: challenge.submissions,
      numberOfSubmissions: challenge.numberOfSubmissions,
      teamSubmissions: challenge.teamSubmissions,
      answers: answerValues,
      scorers: challenge.scorers,
      niceCategories: challenge.niceCategories
    }
  }
  var event = {
    _id: req.ctfEvent._id,
    challenges: req.ctfEvent.challenges || [],
    created: req.ctfEvent.created,
    description: req.ctfEvent.description,
    start: req.ctfEvent.start,
    end: req.ctfEvent.end,
    registrationStart: req.ctfEvent.registrationStart,
    registrationEnd: req.ctfEvent.registrationEnd,
    score: teams,
    settings: req.ctfEvent.settings,
    teams: req.ctfEvent.teams,
    title: req.ctfEvent.title,
    users: req.ctfEvent.users
  }
  res.json(event);
};

var scoreChoice = function(currentChallenge, currentSubmission, scorers){
  if(currentChallenge.challengeFormat === 'radio'){
    for (var answer = 0; answer < currentChallenge.answers.length; ++answer) {
      var same = currentChallenge.answers[answer].value == currentSubmission.answer
      if (same && currentChallenge.answers[answer].correct
        && scorers.indexOf(currentSubmission.team) < 0) {
        scorers.push(currentSubmission.team)
      }
    }
  } else if(currentChallenge.challengeFormat === 'multi-select'){
    var numberCorrect = currentChallenge.answers.reduce(function(n, answer) {
      return n + (answer.correct);
    }, 0);
    var foundCorrect = 0;
    for (var answer = 0; answer < currentChallenge.answers.length; ++answer) {
      var same = currentChallenge.answers[answer].value === currentSubmission.answer
      if (same && currentChallenge.answers[answer].correct){
        foundCorrect += 1;
      }
    }
    if (foundCorrect === numberCorrect && scorers.indexOf(currentSubmission.team) < 0){
      scorers.push(currentSubmission.team)
    }
  }
  return scorers
}

var scoreText = function(currentChallenge, currentSubmission, scorers){
  for (var answer = 0; answer < currentChallenge.answers.length; ++answer) {
    var same = currentChallenge.answers[answer].regex ?
      RegExp(currentChallenge.answers[answer].value).test(currentSubmission.answer) :
      currentChallenge.answers[answer].value === currentSubmission.answer
    if (same && currentChallenge.answers[answer].correct
      && scorers.indexOf(currentSubmission.team) < 0) {
      scorers.push(currentSubmission.team)
    }
  }
  return scorers
}

exports.update = function (req, res) {
  var ctfEvent = req.ctfEvent;
  ctfEvent.title = req.body.title;
  ctfEvent.start = req.body.start;
  ctfEvent.end = req.body.end;
  ctfEvent.teams = req.body.teams;
  ctfEvent.challenges = req.body.challenges;
  ctfEvent.users = req.body.users;
  ctfEvent.save(function (err) {
    if (err) {
      console.log(err)
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvent);
    }
  });
};

exports._read = function (req, res){
  res.json(req.ctfEvent);
}

exports.delete = function (req, res) {
  var ctfEvent = req.ctfEvent;
  ctfEvent.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvent);
    }
  });
};

exports.list = function (req, res) {
  CtfEvent.find().sort('-created').exec(function (err, ctfEvents) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(ctfEvents);
    }
  });
};

exports.ctfEventByID = function (req, res, next, id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'CtfEvent is invalid'
    });
  }
  CtfEvent.findById(id).exec(function (err, ctfEvent) {
    if (err) {
      return next(err);
    } else if (!ctfEvent) {
      return res.status(404).send({
        message: 'No ctfEvent with that identifier has been found'
      });
    }
    req.ctfEvent = ctfEvent;
    next();
  });
};
