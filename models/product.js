const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    //checked if id exists so I don't always initialize id since it'll get me in the if statement
    //when saving the product instead of else if I was adding a product
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  async save() {
    try {
      const db = getDb();
      let result;
      if (this._id) {
        //update the product
        result = await db
          .collection("products")
          //$set is a mongodb special property name 'key' to update, reminder: _id will not change
          .updateOne({ _id: this._id }, { $set: this });
      } else {
        //there's insert many as well that recieves array of objects ({})
        result = await db.collection("products").insertOne(this);
      }
      return result;
    } catch (err) {
      console.log(err);
    }
  }

  static async fetchAll() {
    try {
      const db = getDb();
      const products = await db.collection("products").find().toArray();
      return products;
    } catch (err) {
      console.log(err);
    }
  }

  static async findById(prodId) {
    const db = getDb();
    //because mongodb wouldn't know I'll be only getting 1 product
    //we use .next() to get the next (which is the last doc here)
    const product = await db
      .collection("products")
      //we had to use mongodb.ObjectId because ids are stored as objectId not as a string in mongo
      .find({ _id: new mongodb.ObjectId(prodId) })
      .next();
    return product;
  }

  static async deleteById(prodId) {
    const db = getDb();
    return await db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodId) });
  }
}

module.exports = Product;
