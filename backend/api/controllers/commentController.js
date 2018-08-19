const {Comment} = require('../models/commentModel');
const {Post} = require('../models/postModel');
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