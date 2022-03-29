import mongoose from 'mongoose';

import TUserCart from './TUserCart';

interface IUserModel extends mongoose.Document {
	_id: string;
	userEmail: string;
	userFullName: string;
	userProfileImage: string;
	campusId: string;
	userRole: string;
	userPhone: string | null;
	userCart: TUserCart;
	createdAt: Date;
	updatedAt: Date;
}

export default IUserModel;
