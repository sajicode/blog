const express = require('express'),
      router = express.Router(),
      commentController = require('../controllers/commentController'),
      {authenticate} = require('../auth/Auth');

router.route('/:id')
  .post(authenticate, commentController.addComment)


module.exports = router;