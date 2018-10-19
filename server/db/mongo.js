
// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/gm-tools", function(err, database) {
  if(!err) {
    console.log("We are connected");
  }
  var db = database.db("gm-tools");
  var collection = db.collection('test');
  var doc1 = {'hello':'doc1'};
  collection.insertOne(doc1);
});
