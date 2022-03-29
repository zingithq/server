import mongoose from 'mongoose';

interface IItemModel extends mongoose.Document {
	_id: string;
	itemName: string;
	isItemVeg: boolean;
	isItemAvailable: boolean;
	outletId: string;
	itemPrice: number;
	itemImageSmall: string;
	itemImageLarge: string;
	itemCategory: string;
	createdAt: Date;
	updatedAt: Date;
}

export default IItemModel;
