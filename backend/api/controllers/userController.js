const {User} = require('../models/userModel'),
      {ObjectID} = require('mongodb');


exports.addUser = function(req, res) {
  let data = req.body;

  let user = new User(data);

  user.save()
    .then(() => {
      return user.generateAuthToken();
    }).then(token => {
      res.header('auth', token).send(user);
    }).catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
};

exports.loginUser = function(req, res) {

  User.findByCredentials(req.body.email, req.body.password)
    .then(user => {
      return user.generateAuthToken()
        .then(token => {
          res.header('auth', token).send(user);
        });
    }).catch(e => res.status(400).send("Invalid email and/or password"));
}