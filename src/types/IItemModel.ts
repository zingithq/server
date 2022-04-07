import { Document } from 'mongoose';

interface IItemModel extends Document {
	_id: string;
	itemName: string;
	isItemVeg: boolean;
	isItemAvailable: boolean;
	outletId: string;
	itemPrice: number;
	itemImageSmall: string;
	itemImageLarge: string;
	campusId: string;
	itemCategory: string;
	createdAt: Date;
	updatedAt: Date;
}

export default IItemModel;
