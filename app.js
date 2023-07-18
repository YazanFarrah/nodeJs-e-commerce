const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
//if we I the views folder which I do, I don't have to right the code below
//but stil I'm writing it to remember how it works
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.findById("64b5423cfe0b85c2b32e1ef4")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const startServer = async () => {
  try {
    await mongoConnect();
    console.log("Database connected");
    app.listen(3000);
  } catch (err) {
    console.log(err);
    // Handle the error appropriately
  }
};

startServer();
