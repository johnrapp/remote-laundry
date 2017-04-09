const dbConnect = require('./db.js');
const express = require('express');
const port = 8080;

dbConnect(function(err, db) {
	exposeApi(db);

	// insertSamplesInDB(db);
});

// The times that define bookings array
const times = [
	'00 - 01',
	'01 - 02',
	'02 - 03',
	'07 - 08',
	'08 - 09',
	'09 - 10',
	'10 - 11',
	'11 - 12',
	'12 - 13',
	'13 - 14',
	'14 - 15',
	'15 - 16',
	'16 - 17',
	'17 - 18',
	'18 - 19',
	'19 - 20',
	'20 - 21',
	'21 - 22',
	'22 - 23',
	'23 - 00'
];

// Maschines in different houses
const maschines = {
	'casa': [0, 1],
	'gamla': [0]
};

const dayNames = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag', 'Söndag'];

function exposeApi(db) {
	const app = express();

	app.listen(port, function () {
		console.log(`Server listening on ${port}`);
	});

	app.use(express.static('public'));

	app.get('/samples', (req, res) => {
		db.laundrySamples.find().limit(5).toArray(function(err, docs) {
			if (err) {
				return res.send(err);
			}
			res.send(docs);
		});
	});

	app.get('/sample', (req, res) => {
		db.laundrySamples.findOne({ house: 'gamla' }, function(err, doc) {
			if (err) {
				return res.send(err);
			}
			res.send(doc);
		});
	});

	app.get('/sample/:house/:index', (req, res) => {
		db.laundrySamples
			.find({ house: req.params.house })
			.sort({ date: -1 })
			// .sort({ date: 1 })
			.skip(parseInt(req.params.index))
			.limit(1)
			.toArray(function(err, docs) {
				if (err) {
					return res.send(err);
				}
				res.send(docs[0]);
			});
	});

	app.get('/meta', (req, res) => {
		res.send({
			times: times,
			maschines: maschines,
			dayNames: dayNames
		})
	});
}

function insertSamplesInDB(db) {
	const request = require('request');
	request('http://johnrapp.online:8080', (err, response, body) => {
		const samples = JSON.parse(body);

		console.log('starting')
		
		samples.forEach((sample) => {
			db.laundrySamples.insert(sample)
		});

		console.log('finished')
	});
}
