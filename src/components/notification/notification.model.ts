import mongoose, { Schema } from 'mongoose';

const NotificationSchema: Schema = new Schema(
	{
		notificationType: {
			type: String,
			required: true,
			enum: [
				'order-placed', // send this notif to outlet owner
				'order-accepted', // send the below notifs to user
				'order-declined',
				'order-prepared',
				'order-almost-prepared',
				'order-collection-pending',
			],
			trim: true,
		},
		notificationMessage: {
			type: String,
			required: true,
			trim: true,
		},
		userId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Notification', NotificationSchema);
