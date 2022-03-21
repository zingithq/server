import mongoose from 'mongoose';

const dbConfig = (dbUri: string) => {
	mongoose.connect(dbUri, () => console.log('Mongodb connected!!'));
	mongoose.connection.on('error', (err: Error) => {
		console.error(`MongoDB connection error: ${err}`);
		throw err;
	});
};

export default dbConfig;
