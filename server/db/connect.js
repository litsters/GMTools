var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb+srv://gmuser:gm-tools@gm-tools-ig9xf.mongodb.net/gm-tools";
MongoClient.connect(uri, function(err, client) {
   const collection = client.db("gmtools").collection("plugins");
   // perform actions on the collection object
   console.log("We are connected!");
   client.close();
});
