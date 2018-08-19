const express = require('express'),
      router = express.Router(),
      postController = require('../controllers/postController'),
      {authenticate} = require('../auth/Auth');

router.route('/')
  .post(authenticate, postController.createPost)
  .get(authenticate, postController.fetchPosts);
  
router.route('/:id')
  .get(authenticate, postController.getPost)
  .put(authenticate, postController.editPost)
  .delete(authenticate, postController.deletePost);


module.exports = router;