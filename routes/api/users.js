const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
// 'express-validator/check' was depreciated above

const User = require('../../models/User'); // user
const gravatar = require('gravatar');	 // avatar
const bcrypt = require('bcryptjs'); 	// encrypt users

// @route 			POST api/users
// @description 	Register user
// @access 			Public

// making a user validator w. express
router.post(
	'/', [ // checks if post request includes a name, valid email, and pass w.8 chars or more, otherwise returns an error
		check('name', 'Name is required').not().isEmpty(),
		check('email', "Please include a valid email").isEmail(),
		check('password', 'Please enter a password with 8 or more characters').isLength({min: 8})
	], 
	async (req, res) => {
		// if errors exist, send bad request(400) w.errors array
		const errors = validationResult(req);
		if(!errors.isEmpty()) {
			// make sure to add return before res.status() if it's not the last one being sent (will throw an error otherwise)
			return res.status(400).json({ errors: errors.array() });
		}
		const { name, password, email } = req.body;
		try {
			// see if user exists
			let user = await User.findOne( { email } );
			if(user) {
				return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
			}
			// get user gravatar
			const avatar = gravatar.url(email, {
				s: '200', // pixel size of avatar
				r: 'pg', // pg content
				d: 'mm' // default image
			});

			// create user
			user = new User({
				name,
				email,
				avatar,
				password
			});
			// encrypt password
			const salt = await bcrypt.genSalt(10);

			user.password = await bcrypt.hash(password, salt);
			// save user
			await user.save();

			
			
			// return json webtoken
			
			res.send('User registered');
		} catch(err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

module.exports = router;