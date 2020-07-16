'use strict';

//User routes
var users = require('../controllers/users.server.controller.js'),
  bodyParser = require('body-parser'),
  multer = require('multer'),
  upload = multer({ dest: './modules/users/client/img/profile/uploads/'});

module.exports = function (app) {

  // Setting up the users profile api
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users')
    .put(users.update);
  app.route('/api/users/listAvailable/:teamId')
    .get(users.listAvailableUsers);
  app.route('/api/users/accounts')
    .delete(users.removeOAuthProvider);
  app.route('/api/users/password')
    .post(users.changePassword);
  //Implementing multer upload function to image folder - fs.writeFile cannot handle binary writes
  app.post('/api/users/picture', upload.single('image_file'), users.changeProfilePicture);

  // Finish by binding the user middleware
  app.param('userId', users.userByID);
};
