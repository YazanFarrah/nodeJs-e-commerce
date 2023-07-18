const Product = require("../models/product");

//GET add product page
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

//POST add product
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const userId = req.user._id;
  //set null for the id because we need to generate an id for the new product and get in the else {} instead of editing
  //the product that is being added which doesn't yet have an id
  const product = new Product(title, price, description, imageUrl, null, userId);
  product
    .save()
    .then((result) => {
      console.log("Created product");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = async (req, res, next) => {
  try {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect("/");
    }
    const productId = req.params.productId;
    const product = await Product.findById(productId);
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: editMode,
      product: product,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.postEditProduct = async (req, res, next) => {
  try {
    //because in the hidden input I used productId as a name so =>
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const product = await new Product(
      updatedTitle,
      updatedPrice,
      updatedDescription,

      updatedImageUrl,
      productId
    );
    await product.save();
    console.log("Updated product!");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

exports.getProducts = async (req, res, next) => {
  const products = await Product.fetchAll();
  return res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const product = await Product.deleteById(productId);
    return res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};
