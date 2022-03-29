import mongoose, { Schema } from 'mongoose';

import ICampusModel from '../../types/ICampusModel';

const CampusSchema: Schema = new Schema(
	{
		campusName: {
			type: String,
			required: true,
			trim: true,
		},
		campusBranch: {
			type: String,
			required: true,
			trim: true,
		},
		campusImageSmall: {
			type: String,
			required: true,
			trim: true,
		},
		campusImageLarge: {
			type: String,
			required: true,
			trim: true,
		},
		campusEmailDomain: {
			// Example: goa.bits-pilani.ac.in
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<ICampusModel>('Campus', CampusSchema);
