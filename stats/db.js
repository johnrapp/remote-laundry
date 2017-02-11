const MongoClient = require('mongodb').MongoClient;
const dburl = 'mongodb://db:27017';

module.exports = function connect() {
  return new Promise(function(resolve, reject) {
    MongoClient.connect(dburl, function(err, db) {
    	if (err) {
    		console.log('Mongo error', err);
        return reject(err);
    	}

      console.log('Connected to Mongo');
    	db.laundrySamples = db.collection('laundrySamples');

      resolve(db);
    });
  });
};
