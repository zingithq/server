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
		campusId: {
			type: Schema.Types.ObjectId,
			ref: 'Campus',
			required: true,
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
		isFav: {
			type: Boolean,
			required: true,
			default: false,
		},
		itemImageSmall: {
			type: String,
			required() {
				return this.isFav === true;
			},
			trim: true,
			default: null,
		},
		itemImageLarge: {
			type: String,
			required() {
				return this.isFav === true;
			},
			trim: true,
			default: null,
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
