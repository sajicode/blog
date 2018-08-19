const {User} = require('../models/userModel'),
      {ObjectID} = require('mongodb');


exports.addUser = function(req, res) {
  let data = req.body;

  let user = new User(data);

  user.save()
    .then(() => {
      return user.generateAuthToken();
    }).then(token => {
      res.header('auth', token).send({user});
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
          res.header('auth', token).send({user});
        });
    }).catch(e => res.status(400).send("Invalid email and/or password"));
};

exports.getUser = function(req, res) {
  let userId = req.params.id;

  if(!ObjectID.isValid(userId)) {
    return res.status(404).send("Invalid id");
  }

  User.findById(userId)
    .populate('blogPosts')
    .then(user => {
      if(!user) {
        return res.status(404).send("User not found");
      }

      res.status(200).send({user})
    }).catch(e => res.status(400).send("Unable to get User"));
};

exports.fetchUsers = function(req, res) {
  User.find({})
    .then(users => {
      if(!users) {
        return res.status(404).send("No users found");
      }

      res.status(200).send({users});
    }).catch(e => res.status(400).send(e));
};

exports.updateUser = function(req, res) {
  let userId = req.params.id;
  let data = req.body;

  User.findByIdAndUpdate(
    {_id: userId},
    {$set: data},
    {new: true}
  ).then(user => {
    if(!user) {
      return res.status(404).send("No user found")
    }

    res.status(200).send({user});
  }).catch(e => res.status(400).send(e));
};

exports.deleteUser = function(req, res) {
  let userId = req.params.id;

  User.findByIdAndRemove(userId)
    .then(user => {
      if(!user) {
        return res.status(404).send("No user found");
      }

      res.status(200).send({user});
    }).catch(e => res.status(400).send(e));
};