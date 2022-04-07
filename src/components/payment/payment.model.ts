import mongoose, { Schema } from 'mongoose';

// TODO: Complete razorpay docs and then model

const PaymentSchema: Schema = new Schema(
	{
		orderId: {
			type: Schema.Types.ObjectId,
			ref: 'Order',
			required: true,
		},
		paymentAmount: {
			type: Number,
			required: true,
		},
		paymentStatus: {
			type: String,
			required: true,
			enum: ['success', 'failed'],
			trim: true,
			lowercase: true,
		},
		razorpayPaymentId: {
			type: String,
			required: true,
		},
		paymentDetails: {
			type: Object,
			required: true,
		},
		isRefundInitiated: {
			type: Boolean,
			required: true,
			default: false,
		},
		refundDetails: {
			type: Object,
			required: false,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Payment', PaymentSchema);
