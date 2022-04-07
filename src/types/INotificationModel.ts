import { Document } from 'mongoose';

interface INotificationModel extends Document {
	_id: string;
	notificationType: string;
	notificationTitle: string;
	notificationMessage: string;
	userId: string;
	createdAt: Date;
	updatedAt: Date;
}

export default INotificationModel;
