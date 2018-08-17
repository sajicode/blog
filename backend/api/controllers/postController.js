const {Post} = require('../models/postModel'),
      {ObjectID} = require('mongodb');

module.exports.createPost = function(req, res) {
  let author = req.user._id;

  if(!ObjectID.isValid(author)) {
    res.status(400).send("Invalid Id");
  }

  req.body.author = author;

  let post = new Post(req.body);

  post.save()
    .then(() => res.status(200).send({post}))
    .catch(e => res.status(400).send(e));
}

module.exports.getPost = function(req, res) {
  let postId = req.params.id;

  Post.findById(postId)
    .populate('author')
    .then(post => {
      if(!post) {
        res.status(400).send("Unable to get Post");
      }

      res.status(200).send(post);
    })
    .catch(e => res.status(400).send(e));
}