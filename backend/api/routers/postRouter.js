const express = require('express'),
      router = express.Router(),
      postController = require('../controllers/postController'),
      {authenticate} = require('../auth/Auth');

router.route('/')
  .post(authenticate, postController.createPost)
  
router.route('/:id')
  .get(authenticate, postController.getPost)


module.exports = router;