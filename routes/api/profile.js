const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route 			GET api/profile/me
// @description 	Get current user profile
// @access 			Private
router.get('/me', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			return res
				.status(400)
				.json({ msg: 'No user profile exists, but you can make one =P' });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route 			POST api/profile
// @description 	Create or update user profile
// @access 			Private

router.post(
	'/', // tells route end -- ex: (www.app/api/profile/)
	[
		auth,
		[
			// array using 2 different auths
			check('status', 'Status required').not().isEmpty(),
			check('skills', 'Skills required').not().isEmpty(),
		],
	],

	async (req, res) => {
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const {
			company,
			website,
			location,
			bio,
			status,
			githubusername,
			skills,
			youtube,
			facebook,
			twitter,
			instagram,
			linkedin,
		} = req.body;

		// build profile obj
		// if (thing exists) put that info into profile w. same name
		const profileFields = {};
		profileFields.user = req.user.id;
		if (company) profileFields.company = company;
		if (website) profileFields.website = website;
		if (location) profileFields.location = location;
		if (bio) profileFields.bio = bio;
		if (status) profileFields.status = status;
		if (githubusername) profileFields.githubusername = githubusername;
		if (skills) {
			profileFields.skills = skills.split(',').map((skill) => skill.trim());
		} // above is a func that strips 'skills' separated by , and returns array of strings

		// build social obj inside profile obj
		profileFields.social = {};
		if (youtube) profileFields.social.youtube = youtube;
		if (facebook) profileFields.social.facebook = facebook;
		if (twitter) profileFields.social.twitter = twitter;
		if (instagram) profileFields.social.instagram = instagram;
		if (linkedin) profileFields.social.linkedin = linkedin;

		try {
			let profile = await Profile.findOne({ user: req.user.id });

			if (profile) {
				// if exists, then update profile
				profile = await Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				);

				return res.json(profile);
			}

			// otherwise, create new profile
			profile = new Profile(profileFields);

			await profile.save();
			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route 			GET api/profile
// @description 	Get all user profiles
// @access 			Public

// takes you to a directory of ALL profiles
router.get('/', async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', [
			'name',
			'avatar',
		]);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route 			GET api/profile/user/:user_id
// @description 	Get target profile by user ID
// @access 			Public

// takes you to a user's profile with /user/id
// *  you could customize this like facebook and other sites
// *  upon creating a profile, it could ask you to register a handle
// *  and check against db, etc.   --   add this functionality later
router.get('/user/:user_id', async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.params.user_id,
		}).populate('user', ['name', 'avatar']);

		if (!profile) {
			return res.status(400).json({ msg: "Dang, they didn't join yet =[" });
		}

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind == 'ObjectId') {
			return res.status(400).json({ msg: "Dang, they didn't join yet =[" });
		}
		res.status(500).send('Server Error');
	}
});

// @route 			DELETE api/profile
// @description 	Delete user, profile, and posts
// @access 			Private

// @ to do -- remove users posts

router.delete('/', auth, async (req, res) => {
	try {
		// remove profile
		await Profile.findOneAndRemove({ user: req.user.id });
		// remove user
		await User.findOneAndRemove({ _id: req.user.id });

		res.json({ msg: 'User is kaput!' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route 			PUT api/profile/experience
// @description 	Add profile experience
// @access 			Private

// could use a POST request instead of put here, but since it's adding to
// a profile we went with PUT.
router.put(
	'/experience',
	[
		auth,
		[
			// 3 required fields
			check('title', 'Job title required').not().isEmpty(),
			check('company', 'Company required').not().isEmpty(),
			check('from', 'From date required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array });
		}

		// receive new job
		const {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		} = req.body;

		// fill new obj with info
		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};

		// get profile by id, send newExp to front, and save job xp
		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.experience.unshift(newExp);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route 			DELETE api/profile/experience/:exp_id
// @description 	Delete experience from profile
// @access 			Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		// get remove index
		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id);

		// take selected out
		profile.experience.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route 			PUT api/profile/education
// @description 	Add profile education
// @access 			Private

// could use a POST request instead of put here, but since it's adding to
// a profile we went with PUT.
router.put(
	'/education',
	[
		auth,
		[
			// 4 required fields
			check('school', 'School required').not().isEmpty(),
			check('degree', 'Degree required').not().isEmpty(),
			check('fieldofstudy', 'Field of study required').not().isEmpty(),
			check('from', 'From date required').not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array });
		}

		// receive new education
		const {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		} = req.body;

		// fill new obj with info
		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};

		// get profile by id, send newEdu to front, and save education history
		try {
			const profile = await Profile.findOne({ user: req.user.id });

			profile.education.unshift(newEdu);

			await profile.save();

			res.json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route 			DELETE api/profile/education/:edu_id
// @description 	Delete education from profile
// @access 			Private

router.delete('/education/:edu_id', auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		// get remove index
		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id);

		// take selected out
		profile.education.splice(removeIndex, 1);

		await profile.save();

		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route 			GET api/profile/github/:username
// @description 	Get github repos for user
// @access 			Public

router.get('/github/:username', (req, res) => {
	try {
		const options = {
			uri: `https://api.github.com/users/${
				req.params.username
			}/repos?per_page=5&sort=created:asc&client_id=${config.get(
				'githubClientId'
			)}&client_secret=${config.get('githubSecret')}`,
			method: 'GET',
			headers: { 'user-agent': 'node.js' },
		};

		request(options, (error, response, body) => {
			if (error) console.error(error);

			if (response.statusCode !== 200) {
				return res.status(404).json({ msg: 'No Github profile found' });
			}

			res.json(JSON.parse(body));
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

module.exports = router;
