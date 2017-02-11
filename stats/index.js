const dbConnect = require('./db.js');
const schedule = require('./schedule.js');
const sample = require('./sample.js');

dbConnect(function(err, db) {
	if (err) {
		return console.error('Mongo error', err);
	}
	console.log('Connected to Mongo');

	schedule(function() {
		// console.log('test')
		sample(db);
	});

});
