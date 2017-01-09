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

const login = require('./login.js');

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(login.auth);
app.use(login.router);

app.get('/', (req, res) => {
	res.redirect('/gamla');
});

app.get('/gamla', (req, res) => {

	request(url_gamla, (err, result, body) => {
		res.send(generateIndex(body));
	});

});

app.get('/casa', (req, res) => {

	request(url_casa, (err, result, body) => {
		res.send(generateIndex(body));
	});

});

app.use('/1602', (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.redirect('/login.html');
	}
});

app.get('/1602', (req, res) => {

	if (req.query.page_id) {
		request({
			url: baseUrl,
			qs: req.query
		}, (err, result, body) => {
			res.send(generate1602(body));
		});
	} else {
		request(url_1602, (err, result, body) => {
			res.send(generate1602(body));
		});
	}

});

function generateIndex(body) {
	const $ = cheerio.load(body);

	$('.band.header').remove();
	$('.band.footer').remove();
	$('.band.bottom-footer').remove();
	$('.band.bottom-footer').remove();
	$('script').remove();

	$('.main .three.columns').remove();

	//Remove all booking links
	$('#tvattbokning a').each(function(i, e) {
		$(e).attr('href', '#');
		$(e).removeClass('ttip');
	});

	$('a[href="?page_id=766&p=laundry&house=gamla"]').attr('href', '/gamla');
	$('a[href="?page_id=766&p=laundry&house=casa"]').attr('href', '/casa');

	const styleSheet = $('<link rel="stylesheet" type="text/css" href="style.css">');
	$('head').append(styleSheet);

	$('title').text('Tvätta på Malmö nation');

	return $.html();
}

function generate1602(body) {
	const $ = cheerio.load(body);

	$('.band.header').remove();
	$('.band.footer').remove();
	$('.band.bottom-footer').remove();
	$('script').remove();

	//Remove house-switching paragraph
	$('p').remove();
	//Remove house-switching paragraph

	$('.main .three.columns .box:nth-child(2)').remove();


	const styleSheet = $('<link rel="stylesheet" type="text/css" href="style1602.css">');
	$('head').append(styleSheet);

	$('title').text('Tvätta på 1602');

	return $.html();
}
