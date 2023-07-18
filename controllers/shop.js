const Product = require("../models/product");
//GET products

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    return res.render("shop/product-list", {
      prods: products,
      pageTitle: "My Shop",
      path: "/products",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  //another way with where
  // Product.findAll({ where: { id: productId } })
  //   .then(products=>{
  //     res.render("shop/product-detail", {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log(err));
  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    return res.render("shop/index", {
      prods: products,
      pageTitle: "My Shop",
      path: "/",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    const product = await Product.findById(prodId);
    await req.user.addToCart(product);
    return res.redirect("/cart");
  } catch (err) {
    console.log(err);
  }
};

exports.postCartDelete = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteAllCartItems = (req, res, next) => {
  req.user
    .deleteAllCartItems()
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};
