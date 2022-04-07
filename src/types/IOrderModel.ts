import { Document } from 'mongoose';

import TOrderReview from './TOrderReview';

interface IOrderModel extends Document {
	_id: string;
	orderUniqueCode: string;
	consumerId: string;
	orderStatus: string;
	orderDeclineReason: string | null;
	outletId: string;
	orderFailedTime: Date | null;
	orderPlacedTime: Date;
	orderPreparedTime: Date | null;
	orderAcceptedTime: Date | null;
	orderDeclinedTime: Date | null;
	orderCollectedTime: Date | null;
	orderExpiredTime: Date;
	orderZingTime: number | null;
	paymentId: string;
	orderTotalAmount: number;
	orderPaymentStatus: string;
	orderSpecialRequest: string | null;
	orderItems: Array<{
		itemId: string;
		quantity: number;
	}>;
	orderReview: TOrderReview;
	createdAt: Date;
	updatedAt: Date;
}

export default IOrderModel;
