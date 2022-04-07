import { Router } from 'express';

import verifyApplicationType from '../../middlewares/verifyApplicationType';
import verifyToken from '../../middlewares/verifyJwt';
import { getItemDetails, setItemAvailability } from './item.controllers';

const router = Router();

router.get('/:itemid', [verifyToken], getItemDetails);

// query string ?available=true || ?available=false
router.patch(
	'/availability/:itemid',
	[verifyApplicationType('zing_owner'), verifyToken],
	setItemAvailability
);

export default router;
