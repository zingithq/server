import { Document } from 'mongoose';

// TODO: Edit types after proper razorpay model

interface IPaymentModel extends Document {
	_id: string;
	orderId: string;
	paymentAmount: number;
	paymentStatus: string;
	paymentDetails: unknown;
	createdAt: Date;
	updatedAt: Date;
}

export default IPaymentModel;
