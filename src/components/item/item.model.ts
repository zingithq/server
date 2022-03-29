import mongoose, { Schema } from 'mongoose';

import IItemModel from '../../types/IItemModel';

const ItemSchema: Schema = new Schema(
	{
		itemName: {
			type: String,
			required: true,
			trim: true,
		},
		isItemVeg: {
			type: Boolean,
			required: true,
		},
		isItemAvailable: {
			type: Boolean,
			required: true,
			default: true,
		},
		outletId: {
			type: Schema.Types.ObjectId,
			ref: 'Outlet',
			required: true,
		},
		itemPrice: {
			type: Number,
			required: true,
		},
		itemImageSmall: {
			type: String,
			required: true,
			trim: true,
		},
		itemImageLarge: {
			type: String,
			required: true,
			trim: true,
		},
		itemCategory: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model<IItemModel>('Item', ItemSchema);
