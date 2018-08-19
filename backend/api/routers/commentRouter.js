const express = require('express'),
      router = express.Router(),
      commentController = require('../controllers/commentController'),
      {authenticate} = require('../auth/Auth');

router.route('/:id')
  .post(authenticate, commentController.addComment)
  .get(authenticate, commentController.getComment)

router.route('/post/:id')
  .get(authenticate, commentController.fetchCommentsByPost);

router.route('/user/:id')
  .get(authenticate, commentController.fetchCommentsByAuthor);


module.exports = router;