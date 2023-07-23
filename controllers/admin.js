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
  // const userId = req.user._id;
  //set null for the id because we need to generate an id for the new product and get in the else {} instead of editing
  //the product that is being added which doesn't yet have an id
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id,
    // can work as well like this since mongo will extract the id onlyuserId: req.user
  });
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
    const productId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const product = await Product.findById(productId);
    (product.title = updatedTitle),
      (product.price = updatedPrice),
      (product.description = updatedDescription),
      (product.imageUrl = updatedImageUrl),
      await product.save();
    console.log("Updated product!");
    res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};

//populate gave us this
/*
 userId: {
      cart: [Object],
      _id: new ObjectId("64b6d5458882014aeb4df84c"),
      name: 'Yazan',
      email: 'Yaz@gmail.com',
      __v: 0
    },

without populate we only got the userId since that's what we stored so populate makes it less 
code and faster way to manually extract everything by ourselves

there's select as well which controls what I want to be returned as well as in popluate I controle too
if forgotten check lec 220 
   .select("title price -_id")
    .populate("userId", "name");
*/

exports.getProducts = async (req, res, next) => {
  const products = await Product.find().populate("userId");
  console.log(products);
  return res.render("admin/products", {
    prods: products,
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const product = await Product.findByIdAndRemove(productId);
    return res.redirect("/admin/products");
  } catch (err) {
    console.log(err);
  }
};
