const express = require('express'),
      api = express.Router(),
      userRouter = require('./routers/userRouter'),
      postRouter = require('./routers/postRouter'),
      commentRouter = require('./routers/commentRouter');

api.use("/users", userRouter);
api.use("/posts", postRouter);
api.use("/comments", commentRouter);

module.exports = api;