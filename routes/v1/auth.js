const db = require('../../controllers/db/index.js');

const express = require('express'),
      session = require('express-session'),
      pgSession = require('connect-pg-simple')(session);
const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

const sess = {
	store: new pgSession(),
	secret: process.env.FOO_COOKIE_SECRET,
	resave: false,
	cookie: {
		maxAge: 30 * 24 * 60 * 60 * 1000
	}, // 30 days
	saveUninitialized: false
};

if (router.get('env') === 'production') {
	router.set('trust proxy', 1);
	sess.cookie.secure = true;
}

router.use(session(sess));


passport.use(new LocalStrategy((username, password, done) => {
	db.users.findByUsername(username, (err, user) => {
		if (err) {
			return done(err);
		}
		if (!user) {
			return done(null, false, { message: 'Incorrect username.' });
		}
		if (user.verifyPassword(password)) {
			return done(null, false, { message: 'Incorrect password.' });
		}
		return done(null, user);
	});
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	db.users.findById(id, (err, user) => {
		done(err, user);
	});
});


router.use(passport.initialize());
router.use(passport.session());

router.post('/session', passport.authenticate('local'), (req, res) => {
	res.status(200);
	res.send(req.user);
	// res.redirect('/tasks');
});

router.delete('/session', (req, res) => {
	req.logout();
	// res.redirect('/');
});

router.get('/session', (req, res) => {
	if (req.user) {
		res.status(200);
		res.send(req.user);
	} else {
		res.status(403);
		res.send();
	}
});

module.exports = router;
