import mongoose from 'mongoose';

interface ICampusModel extends mongoose.Document {
	_id: string;
	campusName: string;
	campusBranch: string;
	campusImageSmall: string;
	campusImageLarge: string;
	campusEmailDomain: string;
	createdAt: Date;
	updatedAt: Date;
}

export default ICampusModel;
