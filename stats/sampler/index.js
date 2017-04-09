const dbConnect = require('./db.js');
const schedule = require('./schedule.js');
const takeSample = require('./sample.js');

let db;
dbConnect(function(err, _db) {
	if (err) {
		return console.error('Mongo error', err);
	}
	console.log('Connected to Mongo');
	db = _db;

	schedule(function() {
		takeSample(db);
	});
});