import mongoose, { Schema } from 'mongoose';

const OrderSchema: Schema = new Schema(
	{
		orderCode: {
			type: String,
			required: true,
			length: 6,
			trim: true,
			unique: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		orderStatus: {
			type: String,
			required: true,
			enum: [
				'failed',
				'placed',
				'accepted',
				'declined',
				'prepared',
				'collected',
				'expired',
			],
			trim: true,
			lowercase: true,
		},
		outletId: {
			type: Schema.Types.ObjectId,
			ref: 'Outlet',
			required: true,
		},
		orderFailedTime: {
			type: Date,
			required: false,
		},
		orderPlacedTime: {
			type: Date,
			required: false,
		},
		orderAcceptedTime: {
			type: Date,
			required: false,
		},
		orderDeclinedTime: {
			type: Date,
			required: false,
		},
		orderCollectedTime: {
			type: Date,
			required: false,
		},
		orderExpiredTime: {
			type: Date,
			required: false,
		},
		orderCollectionOtp: {
			type: Number,
			required: true,
			length: 6,
			unique: true,
		},
		orderZingTime: {
			// number of minutes to prepare food according to outlet owner
			type: Number,
			required: false,
		},
		paymentId: {
			type: Schema.Types.ObjectId,
			ref: 'Payment',
			required: false,
		},
		orderPaymentStatus: {
			type: String,
			required: false,
			enum: ['failed', 'paid'],
			trim: true,
			lowercase: true,
		},
		orderTotalAmount: {
			type: Number,
			required: true,
		},
		orderSpecialRequest: {
			type: String,
			required: false,
			trim: true,
			lowercase: true,
		},
		orderItems: [
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
			},
		],
		orderReview: {
			zingTimeRating: {
				type: Number,
				required: false,
				min: 1,
				max: 5,
			},
			foodServiceRating: {
				type: Number,
				required: false,
				min: 1,
				max: 5,
			},
			appExperienceRating: {
				type: Number,
				required: false,
				min: 1,
				max: 5,
			},
			additionalReview: {
				type: String,
				required: false,
				trim: true,
				lowercase: true,
			},
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Order', OrderSchema);
