const dbConnect = require('./db.js');
const sample = require('./sample.js');

dbConnect().then(function(db) {
	sample(db);
});
