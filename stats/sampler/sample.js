/*jshint esversion: 6 */

const fs = require('fs');
const request = require('request');
// const express = require('express');
const cheerio = require('cheerio');

const baseUrl = 'https://www.malmonation.com/intern';
const url_1602 = 'https://www.malmonation.com/intern/?p=laundry&house=gamla';
const url_gamla = 'https://www.malmonation.com/intern/?p=laundry&house=gamla';
const url_casa = 'https://www.malmonation.com/intern/?p=laundry&house=casa';


let db;
module.exports = function sample(_db) {
  db = _db;

  console.log('Taking sample', new Date());
  request(url_gamla, (err, result, body) => {
    if (err) {
      return console.error('gamla err', err);
    }
    try {
      generateSample(body, 'gamla');
    } catch (e) {
      console.error('sample error gamla');
    }
	});
	request(url_casa, (err, result, body) => {
    if (err) {
      return console.error('casa err', err);
    }
    try {
		    generateSample(body, 'casa');
    } catch (e) {
      console.error('sample error casa');
    }
	});
};

function generateSample(body, house) {
	const $ = cheerio.load(body);

  const table = $('#tvattbokning');

  const titles = table.find('tr:first-child br').map(function(i, el) {
    const day = $(el.previousSibling);
    const date = $(el.nextSibling);

    return {
      weekday: day.text().trim(),
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

	const weekdays = resolveWeekdays(titles.map(function(title) {
		return title.weekday;
	}));

	const days = titles.map(function(title, i) {
		return {
			date: title.date,
			weekday: weekdays[i],
			bookings: bookings[i]
		};
	});

	const sample = {
		date: new Date(),
		house: house,
		days: days
	};

	db.laundrySamples.insert(sample, function(err, docs) {
    if (err) {
      return console.error('Insert error', err);
    }
		console.log('Inserted sample', house);
	});
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

const dayOrder = 'måndag tisdag onsdag torsdag fredag lördag söndag'.split(' ');
function resolveWeekdays(days) {
	const weekdays = [];

	// 0 is always today, 1 is always tomorrow
	for (let i = 2; i < days.length; i++) {
		weekdays[i] = dayOrder.indexOf(days[i]);
	}

	// One day before
	weekdays[1] = (weekdays[2] + dayOrder.length - 1) % dayOrder.length;
	weekdays[0] = (weekdays[1] + dayOrder.length - 1) % dayOrder.length;

	return weekdays;
}
