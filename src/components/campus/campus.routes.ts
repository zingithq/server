import { Router } from 'express';
import verifyApplicationType from '../../middlewares/verifyApplicationType';
import verifyToken from '../../middlewares/verifyJwt';
import { getCampusFavorites, getCampusDetails } from './campus.controllers';

const router = Router();

router.get(
	'/favorite/:campusid',
	[verifyApplicationType('zing_consumer'), verifyToken],
	getCampusFavorites
);

router.get('/:campusid', [verifyToken], getCampusDetails);

export default router;
