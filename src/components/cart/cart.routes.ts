import { Router } from 'express';

import verifyApplicationType from '../../middlewares/verifyApplicationType';
import verifyToken from '../../middlewares/verifyJwt';
import { addItem, clearCart, getCart, removeItem } from './cart.controllers';

const router = Router();

router.get('/', [verifyApplicationType('zing_consumer'), verifyToken], getCart);

router.patch(
	'/add',
	[verifyApplicationType('zing_consumer'), verifyToken],
	addItem
);

router.patch(
	'/remove',
	[verifyApplicationType('zing_consumer'), verifyToken],
	removeItem
);

router.patch(
	'/clear',
	[verifyApplicationType('zing_consumer'), verifyToken],
	clearCart
);

export default router;
