import { Document } from 'mongoose';

import TUserCart from './TUserCart';

interface IUserModel extends Document {
	_id: string;
	userEmail: string;
	userFullName: string;
	userProfileImage: string;
	campusId: string;
	userRole: string;
	userPhone: string;
	userCart: TUserCart;
	createdAt: Date;
	updatedAt: Date;
}

export default IUserModel;
