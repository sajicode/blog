const express = require('express'),
      api = express.Router(),
      userRouter = require('./routers/userRouter'),
      postRouter = require('./routers/postRouter');

api.use("/users", userRouter);
api.use("/posts", postRouter);

module.exports = api;