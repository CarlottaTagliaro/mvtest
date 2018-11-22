var express = require('express'),
	router = express.Router();

const db = require('../../controllers/db.js');

const passport = require('passport');
const Strategy = require('passport-local').Strategy;

var session = require('express-session');

router.use(session({
	store: new(require('connect-pg-simple')(session))(),
	secret: 'kekkeke',
	resave: false,
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000
	}, // 30 days
	saveUninitialized: false,
}));

passport.serializeUser((user, cb) => {
	cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
	db.users.findById(id, (err, user) => {
		if (err) {
			return cb(err);
		}
		cb(null, user);
	});
});

passport.use(new Strategy((username, password, cb) => {
	db.users.findByUsername(username, (err, user) => {
		if (err) {
			return cb(err);
		}
		if (!user) {
			return cb(null, false);
		}
		if (user.password != password) {
			return cb(null, false);
		}
		return cb(null, user);
	});
}));

router.get('/session', (req, res) => {
	if (req.user) {
		res.status(200);
		res.send(req.user);
	} else {
		res.status(403);
		res.send();
	}
});

router.put('/session', passport.authenticate('local'), (req, res) => {
	res.status(200);
	res.send(req.user);
});

router.delete('/session', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.use(passport.initialize());
router.use(passport.session());

module.exports = router;