// connect server to database
const mongoose = require('mongoose');
const config = require('config');
// container for MongoDB Atlas server
const db = config.get('mongoURI');

// async connect func w/ error catch
const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});

		console.log('MongoDB Connected..');
	} catch (err) {
		console.error(err.message);
		// exit after failure
		process.exit(1);
	}
};

module.exports = connectDB;
