import mongoose, { Schema } from 'mongoose';

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
		paymentDetails: {
			type: Object,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Payment', PaymentSchema);
