// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// let _db;
// const mongoConnect = (callBack) => {
//   MongoClient.connect(
//     "mongodb+srv://yazanfarrah03:yazan@cluster0.utlybpr.mongodb.net/shop?retryWrites=true&w=majority"
//   )
//     .then((client) => {
//       console.log("Connected to mongoDB");
//       _db = client.db();
//       callBack();
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// const getDb = ()=>{
//   if(_db){
//     return _db;
//   }
//   throw 'No database found'
// }

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;



const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async () => {
  try {
    const client = await MongoClient.connect(
      "mongodb+srv://yazanfarrah03:yazan@cluster0.utlybpr.mongodb.net/shop?retryWrites=true&w=majority"
    );
    console.log("Connected to MongoDB");
    _db = client.db();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
};

module.exports = { mongoConnect, getDb };

