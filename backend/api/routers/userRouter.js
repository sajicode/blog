const express = require('express'),
      router = express.Router(),
      userController = require('../controllers/userController'),
      {authenticate} = require('../auth/Auth');

router.route('/register')
  .post(userController.addUser);

router.route('/login')
  .post(userController.loginUser);

router.route('/')
  .get(authenticate, userController.fetchUsers);


router.route('/:id')
  .get(authenticate, userController.getUser)
  .put(authenticate, userController.updateUser)


module.exports = router;