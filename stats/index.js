const dbConnect = require('./db.js');
const schedule = require('./schedule.js');
const sample = require('./sample.js');

let db;
dbConnect(function(err, _db) {
	if (err) {
		return console.error('Mongo error', err);
	}
	console.log('Connected to Mongo');
	db = _db;

	schedule(function() {
		// console.log('test')
		sample(db);
	});

});

// TODO remove
const express = require('express');
const port = 8080;
const app = express();

app.listen(port, function () {
	console.log(`Server listening on ${port}`);
});

app.get('/', (req, res) => {
	db.laundrySamples.find({}).toArray(function(err, docs) {
		if (err) {
			return res.send(err);
		}
		res.send(docs);
	});
});
