const request = require('request');
const express = require('express');
const cheerio = require('cheerio');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const port = 8080;

const app = express();

app.listen(port, function () {
	console.log(`Server listening on ${port}`);
});

const baseUrl = 'https://www.malmonation.com/intern';
const url = 'https://www.malmonation.com/intern/?p=laundry&house=gamla';

const login = require('./login.js');

app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded());
app.use(login.auth);
app.use(login.router);

app.use('/', (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.redirect('/login.html');
	}
});

app.get('/', (req, res) => {

	if (req.query['page_id']) {
		request({
			url: baseUrl,
			qs: req.query
		}, (err, result, body) => {
			res.send(generateHtml(body));
		});
	} else {
		request(url, (err, result, body) => {
			res.send(generateHtml(body));
		});
	}
	
});

function generateHtml(body) {
	const $ = cheerio.load(body);

	$('.band.header').remove();
	$('.band.footer').remove();
	$('.band.bottom-footer').remove();
	$('script').remove();

	return $.html();
}