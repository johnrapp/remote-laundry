const MongoClient = require('mongodb').MongoClient;
const dburl = 'mongodb://db:27017';

module.exports = function connect(callback) {
  MongoClient.connect(dburl, function(err, db) {
  	db.laundrySamples = db.collection('laundrySamples');

    callback(err, db);
  });
};
