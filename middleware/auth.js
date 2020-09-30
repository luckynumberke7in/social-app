const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
	// get token from header -- request, response, and callback func
	const token = req.header('x-auth-token');

	// check if token exists
	if(!token) {
		return res.status(401).json({ msg: 'No token, authorization denied' });
	}

	// verify existing token for user
	try {
		const decoded = jwt.verify(token, config.get('jwtSecret'));

		req.user = decoded.user;
		next();
	} catch(err) {
		res.status(401).json({ msg: 'Token not valid' })
	}
};