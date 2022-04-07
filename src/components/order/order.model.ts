import mongoose, { Schema } from 'mongoose';

import IOrderModel from '../../types/IOrderModel';

const OrderSchema: Schema = new Schema(
	{
		orderUniqueCode: {
			type: String,
			required: true,
			length: 6,
			trim: true,
			unique: true,
		},
		consumerId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		orderStatus: {
			type: String,
			required: true,
			enum: [
				'failed', // order placement failed due to technical reasons
				'placed', // order placed but not accepted
				'accepted', // order accepted by outlet
				'declined', // order declined by outlet
				'timer_expired', // zing time expired
				'prepared', // owner clicks on prepared button
				'collected', // owner has collected order
				'expired', // consumer didn't collect order
			],
			trim: true,
			lowercase: true,
		},
		orderDeclineReason: {
			type: String,
			required: false,
			default: null,
		},
		outletId: {
			type: Schema.Types.ObjectId,
			ref: 'Outlet',
			required: true,
		},
		orderFailedTime: {
			type: Date,
			required: false,
			default: null,
		},
		orderPlacedTime: {
			type: Date,
			required: true,
		},
		orderPreparedTime: {
			type: Date,
			required: false,
			default: null,
		},
		orderAcceptedTime: {
			type: Date,
			required: false,
			default: null,
		},
		orderDeclinedTime: {
			type: Date,
			required: false,
			default: null,
		},
		orderCollectedTime: {
			type: Date,
			required: false,
			default: null,
		},
		orderExpiredTime: {
			type: Date,
			required: true,
		},
		orderCollectionOtp: {
			type: Number,
			required: true,
			length: 4,
		},
		orderZingTime: {
			// number of minutes to prepare food according to outlet owner
			type: Number,
			required: false,
			default: null,
		},
		paymentId: {
			type: Schema.Types.ObjectId,
			ref: 'Payment',
			required: true,
		},
		orderPaymentStatus: {
			type: String,
			required: false,
			enum: ['fail', 'success'],
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
				default: null,
			},
			foodServiceRating: {
				type: Number,
				required: false,
				min: 1,
				max: 5,
				default: null,
			},
			appExperienceRating: {
				type: Number,
				required: false,
				min: 1,
				max: 5,
				default: null,
			},
			additionalReview: {
				type: String,
				required: false,
				trim: true,
				lowercase: true,
				default: null,
			},
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IOrderModel>('Order', OrderSchema);
