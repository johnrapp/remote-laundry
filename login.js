const router = require('express').Router();
const credentials = require('./credentials.json');

const cookieOptions = { maxAge: 900000 };

const auth = (req, res, next) => {
	const { username, password } = req.cookies;
	if (username === credentials.username && password == credentials.password) {
		req.user = {};
	}
	next();
};

router.post('/login', (req, res) => {
	const { username, password } = req.body;
	res.cookie('username', username, cookieOptions);
	res.cookie('password', password, cookieOptions);

	res.redirect('/');
});

module.exports = {
	auth,
	router
};