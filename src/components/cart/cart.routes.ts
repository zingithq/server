import { Router } from 'express';

import verifyApplicationType from '../../middlewares/verifyApplicationType';
import verifyToken from '../../middlewares/verifyJwt';
import { addItem, clearCart, getCart, removeItem } from './cart.controllers';

const router = Router();

router.get('/', [verifyApplicationType('zing_student'), verifyToken], getCart);
router.put(
	'/add',
	[verifyApplicationType('zing_student'), verifyToken],
	addItem
);
router.put(
	'/remove',
	[verifyApplicationType('zing_student'), verifyToken],
	removeItem
);
router.put(
	'/clear',
	[verifyApplicationType('zing_student'), verifyToken],
	clearCart
);

export default router;
