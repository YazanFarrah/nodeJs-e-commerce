//3rd party packages
const express = require("express");

const app = express();

app.use("/", (req, res, next) => {
  console.log("This always runs!");
  next();
});

app.use("/add-product", (req, res, next) => {
  console.log("In another middlware!");
  res.send("<h1>Add Product Page!<h1/>");
  //didn't add next() here so it doesn't go to the below middle ware ('/')
  //since it's from top => bottom, and added ('/') below it
  //so when it matches it's sure that it wasn't  add-product but '/'
});

app.use("/", (req, res, next) => {
  console.log("In another middlware!");
  res.send("<h1>Hello from Express!<h1/>");
});

app.listen(3000);
