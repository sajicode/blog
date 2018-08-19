const {Comment} = require('../models/commentModel');
const {Post} = require('../models/postModel');
const {User} = require('../models/userModel');
const {ObjectID} = require('mongodb');

exports.addComment = function(req, res) {
  let postId = req.params.id;
  let userId = req.user._id;
  req.body.user = userId;

  let comment = new Comment(req.body);
  
  comment.save()
    .then(() => {
      Post.findById(postId).then(post => {
        post.comments.push(comment)
        post.save()
      })
      .then(() => res.status(200).send({comment}))
    })
    .catch(e => res.status(400).send(e));
};

exports.getComment = function(req, res) {
  let commentId = req.params.id;

  Comment.findById(commentId)
    .populate('user')
    .then(comment => {
      if(!comment) { return res.status(400).send("Unable to get comment"); }
      res.status(200).send({comment});
    })
    .catch(e => res.status(400).send(e));
};

exports.fetchCommentsByPost = function(req, res) {
  let postId = req.params.id;

  Post.findById(postId)
    .populate('comments')
    .then(post => {
      if(!post) {
        return res.status(400).send("Unable to find post")
      }
      res.status(200).send(post.comments)
    })
    .catch(e => res.status(400).send(e));
};

exports.fetchCommentsByAuthor = function (req, res) {
  let userId = req.params.id;

  Comment.find({user: userId})
    .then(comments => {
      if(!comments) {
        return res.status(400).send("Unable to find comments")
      }
      res.status(200).send({comments})
    })
    .catch(e => res.status(400).send(e));
};