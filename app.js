const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://yazanfarrah03:yazan@cluster0.utlybpr.mongodb.net/shop";

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
//if we I the views folder which I do, I don't have to right the code below
//but stil I'm writing it to remember how it works
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res, next) => {
  User.findById("64b6d5458882014aeb4df84c")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

// const startServer = async () => {
//   try {
//     const db = await mongoose.connect(
//       "mongodb+srv://yazanfarrah03:yazan@cluster0.utlybpr.mongodb.net/?retryWrites=true&w=majority"
//     );
//     console.log("Database connected");
//     app.listen(3000);
//   } catch (err) {
//     console.log(err);
//   }
// };
// startServer();
mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    User.findOne()
      .then((user) => {
        if (!user) {
          const user = new User({
            name: "Yazan",
            email: "Yaz@gmail.com",
            cart: {
              items: [],
            },
          });
          user.save();
        }
      })
      .catch((err) => console.log(err));

    console.log("DB connected");
    app.listen(3000);
  })
  .catch();
