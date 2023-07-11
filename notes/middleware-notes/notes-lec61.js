const http = require("http");

//3rd party packages
const express = require("express");

const app = express();

//app.use() allow us to add a new middleware
app.use((req, res, next) => {
  console.log("In the middlware!");
  //call next() so it travels to the following app.use middleware
  //or else In another middlware won't be triggered
  next();
});

app.use((req, res, next) => {
  console.log("In another middlware!");
  res.send('<h1>Hello from Express!<h1/>');
});
const server = http.createServer(app);

server.listen(3000);
