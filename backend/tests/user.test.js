const expect = require('expect');
const request = require('supertest');
const {
  ObjectID
} = require('mongodb');
const {
  app
} = require('../app');
const {
  User
} = require('../api/models/userModel');
const {
  users,
  populateUsers
} = require('./seed/seed');

beforeEach(populateUsers);

describe('#USERS', () => {
  describe('POST /user', () => {
    it('should create a new user', (done) => {
      let email = "evelyn@afcs.com";
      let firstname = "Mfoniso";
      let lastname = "Hilary";
      let password = "larylyn";

      request(app)
        .post('/api/users/register')
        .send({
          email,
          password,
          firstname,
          lastname
        })
        .expect(200)
        .expect(res => {
          expect(res.header['auth']).toBeTruthy();
          expect(res.body.user._id).toBeTruthy();
          expect(res.body.user.email).toBe(email);
        })
        .end(err => {
          if (err) {
            return done(err);
          }

          User.findOne({
            email
          }).then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          }).catch(err => done(err));
        });
    });

  });

  describe('GET /users', () => {
    it('should return an authenticated user', (done) => {
      let hexId = users[1]._id.toHexString();
      request(app)
        .get(`/api/users`)
        .set('auth', users[1].tokens[0].token)
        .expect(res => {
          console.log(res.body);
        })
        .end(done);
    });
  })


});