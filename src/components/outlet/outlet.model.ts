import mongoose, { Schema } from 'mongoose';

import IOutletModel from '../../types/IOutletModel';

const OutletSchema: Schema = new Schema(
	{
		campusId: {
			type: Schema.Types.ObjectId,
			ref: 'Campus',
			required: true,
		},
		ownerId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		outletName: {
			type: String,
			required: true,
			trim: true,
		},
		outletDescription: {
			type: String,
			required: true,
			trim: true,
		},
		outletImageSmall: {
			type: String,
			required: true,
			trim: true,
		},
		outletImageLarge: {
			type: String,
			required: true,
			trim: true,
		},
		isOutletActive: {
			type: Boolean,
			default: true,
		},
		outletCategory: {
			type: String,
			enum: ['dining', 'snacks', 'cafe', 'bakery', 'beverage', 'other'],
			required: true,
			lowercase: true,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);
export default mongoose.model<IOutletModel>('Outlet', OutletSchema);
