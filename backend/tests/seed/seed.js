const {ObjectID} = require('mongodb'),
      jwt = require('jsonwebtoken'),
      {User} = require('../../api/models/userModel');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [
  {
    _id: userOneId,
    firstname: "Simisola",
    lastname: "Renee",
    email: "simi@design.com",
    password: "rebecca",
    tokens: [{
      token: jwt.sign(
        {_id: userOneId},
        process.env.SECRET
      ).toString()
    }]
  },
  {
    _id: userTwoId,
    firstname: "Wendy",
    lastname: "Yeri",
    email: "wendy@canada.com",
    password: "olubunmi",
    tokens: [{
      token: jwt.sign(
        {_id: userTwoId},
        process.env.SECRET
      ).toString()
    }]
  }
];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    let userOne = new User(users[0]).save();
    let userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {
  users,
  populateUsers
};