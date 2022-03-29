import mongoose, { Schema } from 'mongoose';

import IUserModel from '../../types/IUserModel';

const UserSchema: Schema = new Schema(
	{
		userEmail: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
		},
		userFullName: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
		userProfileImage: {
			// TODO: Add profile Image link for default
			type: String,
			required: true,
			trim: true,
			default: 'https://google.com/imgae',
		},
		campusId: {
			type: Schema.Types.ObjectId,
			ref: 'Campus',
			required: true,
		},
		userRole: {
			type: String,
			required: true,
			enum: ['owner', 'student'],
			lowercase: true,
		},
		userPhone: {
			type: String,
			required() {
				return this.role === 'owner';
			},
			trim: true,
			lowercase: true,
			unique: true,
			length: 10,
		},
		userCart: [
			{
				itemId: {
					type: Schema.Types.ObjectId,
					ref: 'Item',
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
				outletId: {
					type: Schema.Types.ObjectId,
					ref: 'Outlet',
					required: true,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IUserModel>('User', UserSchema);
