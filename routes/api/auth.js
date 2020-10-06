const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');

// @route 			GET api/auth
// @description 	Test Route
// @access 			Public

// putting middleware/auth as arg here adds protection. program now needs a jwt to verify. using async callback func
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		// '-password' leaves password out
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route 			POST api/auth
// @description 	Authenticate user + get token (Log user in)
// @access 			Public

// user and password validator
router.post(
	'/',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password required').exists(),
	],
	// asynchronous callback receiving input email and password, verifies against database w. encryption
	async (req, res) => {
		// if errors exist, send bad request(400) w.errors array
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			// see if user exists
			let user = await User.findOne({ email });

			if (!user) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid username / password' }] });
			}
			// compare input credentials - username and password
			const isMatch = await bcrypt.compare(password, user.password);

			if (!isMatch) {
				return res
					.status(400)
					.json({ errors: [{ msg: 'Invalid username / password' }] });
			} // use same error msg for both username and password

			// get payload for webtoken
			const payload = {
				user: {
					id: user.id,
				},
			};
			// callback function returning error or verified json webtoken
			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{ expiresIn: 360000 },
				// change to 3600 after testing is done
				(err, token) => {
					if (err) throw err;
					res.json({ token });
				}
			);
		} catch (err) {
			console.error(err.message);
			res.status(500).send(['Server Error', err.message]);
		}
	}
);

module.exports = router;
