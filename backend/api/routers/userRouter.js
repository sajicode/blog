const express = require('express'),
      router = express.Router(),
      userController = require('../controllers/userController'),
      {authenticate} = require('../auth/Auth');

router.route('/register')
  .post(userController.addUser);

router.route('/login')
  .post(userController.loginUser);


module.exports = router;