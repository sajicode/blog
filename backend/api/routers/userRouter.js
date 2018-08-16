const express = require('express'),
      router = express.Router(),
      userController = require('../controllers/userController'),
      {authenticate} = require('../auth/Auth');

router.route('/register')
  .post(userController.addUser);


module.exports = router;