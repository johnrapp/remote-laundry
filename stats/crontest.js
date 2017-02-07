/*jshint esversion: 6 */

const fs = require('fs');
const request = require('request');
const express = require('express');
const cheerio = require('cheerio');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const dburl = 'mongodb://db:27017';
let db;


MongoClient.connect(dburl, function(err, _db) {
	if (err) {
		return console.log('Mongo error', err);
	}

  console.log('Connected to Mongo');
	db = _db;
	db.laundrySamples = db.collection('laundrySamples');

  db.laundrySamples.insert({cron: new Date()}, () => {
    db.close()
  });
});
