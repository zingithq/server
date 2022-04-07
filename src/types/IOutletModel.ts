import { Document } from 'mongoose';

interface IOutletModel extends Document {
	_id: string;
	campusId: string;
	ownerId: string;
	outletName: string;
	outletDescription: string;
	outletImageSmall: string;
	outletImageLarge: string;
	isOutletActive: boolean;
	outletCategory: string;
	createdAt: Date;
	updatedAt: Date;
}

export default IOutletModel;
