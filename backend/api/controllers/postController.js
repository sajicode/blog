const {Post} = require('../models/postModel'),
      {User} = require('../models/userModel'),
      {ObjectID} = require('mongodb');

module.exports.createPost = function(req, res) {
  let author = req.user._id;

  if(!ObjectID.isValid(author)) {
    return res.status(400).send("Invalid Id");
  }

  req.body.author = author;

  let post = new Post(req.body);

  post.save()
    .then(() => {
      User.findById(author).then(user => {
        user.blogPosts.push(post)
        user.save()
      })
      .then(() => res.status(200).send({post}))
    })
    .catch(e => res.status(400).send(e));

};

module.exports.getPost = function(req, res) {
  let postId = req.params.id;

  Post.findById(postId)
    .populate('author')
    .populate('comments')
    .then(post => {
      if(!post) {
        return res.status(400).send("Unable to get Post");
      }

      res.status(200).send(post);
    })
    .catch(e => res.status(400).send(e));
};

module.exports.fetchPosts = function(req, res) {
  let author = req.user._id;

  if(!ObjectID.isValid(author)) {
    return res.status(400).send("Invalid Id");
  }

  Post.find({author})
    .populate('author')
    .populate('comments.user')
    .then(posts => {
      if(!posts) {
        return res.status(400).send("Found no posts");
      }

      res.status(200).send({posts});
    })
    .catch(e => res.status(400).send(e));
};

module.exports.editPost =  function(req, res) {
  let postId = req.params.id;
  let data = req.body;

  Post.findByIdAndUpdate(
    {_id: postId},
    {$set: data},
    {new: true}
  ).then(post => {
    if(!post) {
      return res.status(400).send("Unable to update post")
    }

    res.status(200).send({post});
  }).catch(e => {
    console.log(e)
    res.status(400).send(e)
  });
  
};

module.exports.deletePost = function(req, res) {
  let postId = req.params.id;

  Post.findByIdAndRemove(postId)
    .then(post => {
      if(!post) { return res.status(400).send("Post not found")}
      res.status(200).send(post);
    })
    .catch(e => res.status(400).send(e));
};