const db = require('../../controllers/db/index.js');

const express = require('express'),
      session = require('express-session');
// pgSession = require('connect-pg-simple')(session)

const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

// const sess = {
// 	//store: new pgSession(),
// 	secret: 'keyboard cat',
// 	cookie: {
// 		maxAge: 30 * 24 * 60 * 60 * 1000
// 	}, // 30 days
// 	resave: false,
// 	saveUninitialized: false
// };

// // if (router.get('env') === 'production') {
// // 	router.set('trust proxy', 1);
// // 	sess.cookie.secure = true;
// // }

// router.use(session(sess));


passport.use(new LocalStrategy({
	usernameField: 'id',
	passwordField: 'pwd'
}, (id, pwd, done) => {
	db.user.getOne(id)
		.then(res => {
			if (true) { //res.pwd === pwd
				done(null, res);
			} else {
				done(null, false, { message: 'Incorrect password.' });
			} 
		})
		.catch(err => {
			if (err.errno === 404) {
				done(null, false, { message: 'No existing user.' });	
			} else{
				done(err);
			}
		});
}));

router.use(passport.initialize());

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	console.log('des!!!:' + user.id);
	db.user.getOne(id)
		.then(res => {
			done(null, res);
		})
		.catch(err => {
			if (err.errno === 404) {
				done(null, false);	
			} else{
				done(err);
			}
		});
	// db.user.getOne(id)
	// 	.then(res => done(null, res))
	// 	.catch(err => done(err));
	// db.user.findById(id, (err, user) => {
	// 	done(err, user);
	// });
	// User.findById(id, function(err, user) {
	// 	done(err, user);
	// });
});

router.use(passport.session());


router.post('/', passport.authenticate('local'), (req, res) => {
	res.status(200);
	res.send(req.body);
});

router.delete('/', (req, res) => {
	req.logout();
});

router.get('/', (req, res) => {
	console.log(req.session);
	if (req.isAuthenticated()) {
		res.status(200);
		res.send(req.user);
	} else {
		res.status(204);
		res.send();
	}
});

module.exports = router;
