const express = require("express");
const app = express();
const mongoose = require("mongoose");
const blogPostsRouter = require('./routers/blogposts');
const categoriesRouter = require('./routers/categories');
const jwt = require('express-jwt');
const errorResponse = require('../../lib/error-response-sender');
var cron = require('node-cron');

app.use(express.json());

// cron.schedule('*/20 * * * * *', () => {
//   console.log('running a task every 20 seconds');
// });

mongoose.connect("mongodb://localhost/ws-gen-11-project", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(jwt({
  // '3218943205PADSOKDASI(*#$U(' random created
  secret: '3218943205PADSOKDASI(*#$U(',
  algorithms: ['HS256']
}).unless({
  // Ask user to login for every route exept /blogposts GET
  path: [
    {
      url: '/blogposts', methods: ['GET']
    },
    {
      url: '/categories', methods: ['GET']
    }
  ]
}));

app.use((err, req, res, next) => {
  console.log(err, err.name, err.name === 'UnauthorizedError')
  if (err.name === 'UnauthorizedError') {
    errorResponse(res, 401, 'You need to log in to perform this action');
  }
})

app.use('/blogposts', blogPostsRouter);
app.use('/categories', categoriesRouter);

app.listen("3000", (error) => {
  if (error) {
    return console.log(
      "Error happened while starting the app on port 3000: ",
      error
    );
  }
  console.log("Blog service successfully started on port 3000");
});
