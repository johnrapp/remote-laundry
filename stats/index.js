/*jshint esversion: 6 */

const fs = require('fs');
const request = require('request');
const express = require('express');
const cheerio = require('cheerio');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

var argv = require('minimist')(process.argv.slice(2));
const port = argv.p || 8080;

const app = express();

app.listen(port, function () {
	console.log(`Server listening on ${port}`);
});

const baseUrl = 'https://www.malmonation.com/intern';
const url_1602 = 'https://www.malmonation.com/intern/?p=laundry&house=gamla';
const url_gamla = 'https://www.malmonation.com/intern/?p=laundry&house=gamla';
const url_casa = 'https://www.malmonation.com/intern/?p=laundry&house=casa';

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get('/', (req, res) => {
request(url_casa, (err, result, body) => {
  // request(url_gamla, (err, result, body) => {
		generateIndex(body);
    // res.send(generateIndex(body));
  });
// });



function generateIndex(body) {
	const $ = cheerio.load(body);


  const table = $('#tvattbokning');

  const titles = table.find('tr:first-child br').map(function(i, el) {
    const day = $(el.previousSibling);
    const date = $(el.nextSibling);

    return {
      day: day.text().trim(),
      date: date.text().trim()
    };
  }).get();

	const rows = table.find('tr').get()
		.filter(function(el, i) {
			return i !== 0 && i !== 4; // Title row or empty row
		})
		.map(function(el, i) {
			return $(el).find('td').get().map(function(el, j) {
				// First column shows time
				if (j === 0) {
					return $(el).text().split(' - ')[0].trim();
				} else {
					return $(el).find('img').get().reduce(function(numberOfBookings, el) {
						return isBooked($(el)) ? numberOfBookings + 1 : numberOfBookings;
					}, 0);
				}
			});
		});

	const times = rows.map(function(row) {
		return row[0]; // First col
	});

	const bookings = bookingsFromRows(rows);

	console.log(titles);
	console.log(times);
	console.log(bookings);

  return table.html();
}

function isBooked(img) {
	switch (img.attr('src')) {
		case 'https://www.malmonation.com/wp-content/themes/mn/img/icon-washer.png':
			return false;
		case 'https://www.malmonation.com/wp-content/themes/mn/img/icon-washer-gray.png':
			return true;
	}
}

// Index by column (day) instead or row (time)
function bookingsFromRows(rows) {
	const bookings = [];

	rows.forEach(function(row) {
		// Skip first index since it's time
		for (let i = 0; i < row.length - 1; i++) {
			if (!(i in bookings)) {
				bookings[i] = [];
			}
			bookings[i].push(row[i + 1]);
		}
	});

	return bookings;
}
