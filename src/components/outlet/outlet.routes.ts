import { Router } from 'express';

import verifyApplicationType from '../../middlewares/verifyApplicationType';
import verifyToken from '../../middlewares/verifyJwt';
import {
	getAvgZingTime,
	getCampusOutlets,
	getOutlet,
	getOutletFavs,
	getOutletMenu,
	setAvailability,
} from './outlet.controllers';

const router = Router();

router.get(
	'/:outletid',
	[verifyApplicationType('zing_consumer'), verifyToken],
	getOutlet
);

router.get(
	'/all/:campusid',
	[verifyApplicationType('zing_consumer'), verifyToken],
	getCampusOutlets
);

router.get(
	'/menu/:outletid',
	[verifyApplicationType('zing_consumer'), verifyToken],
	getOutletMenu
);

router.get(
	'/avgzingtime/:outletid',
	[verifyApplicationType('zing_consumer'), verifyToken],
	getAvgZingTime
);

router.get(
	'/favourites/:outletid',
	[verifyApplicationType('zing_consumer'), verifyToken],
	getOutletFavs
);

// query string ?set=close || ?set=open
router.patch(
	'/availability/:outletid',
	[verifyApplicationType('zing_owner'), verifyToken],
	setAvailability
);

export default router;
