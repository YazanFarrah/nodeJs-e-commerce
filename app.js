const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");


const app = express();

app.set("view engine", "ejs");
//if we I the views folder which I do, I don't have to right the code below
//but stil I'm writing it to remember how it works
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require('./models/order');
const OrderItem = require('./models/order-items');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next)=>{
  User.findByPk(1).then(
    user=>{
      req.user = user;
      next();
    }
  ).catch(err=>console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
//cascade onDelete means that the products of the user whom was deleted would be deleted too!
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});


sequelize
  //force is to overwrite the tables
  // .sync({ force: true })
  .sync()
  .then((result) => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Yazan", email: "yaz@gmail.com" });
    }
    // we can do this to make sure that either ways the return type is a promise 
    // but it's already managed for us so we don't have to worry about it return Promise.resolve(user);
    
    return user;
  })
  .then(user=>{
    return user.createCart();
  }).then(cart=>{
    app.listen(3000);

  })
  .catch((err) => console.log(err));
