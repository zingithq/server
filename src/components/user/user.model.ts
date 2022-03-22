import mongoose, { Schema } from 'mongoose';

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
		campusId: {
			type: Schema.Types.ObjectId,
			ref: 'Campus',
			required: true,
		},
		userRole: {
			type: String,
			required: true,
			enum: ['owner', 'user'],
			lowercase: true,
		},
		// userHostel: {
		// 	type: String,
		// 	required() {
		// 		return this.role === 'user';
		// 	},
		// 	trim: true,
		// 	lowercase: true,
		// },
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

module.exports = mongoose.model('User', UserSchema);
