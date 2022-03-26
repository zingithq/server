import { Router } from 'express';

import verifyApplicationType from '../../middlewares/verifyApplicationType';
import { auth } from './user.controllers';

const router = Router();

router.post('/auth', [verifyApplicationType('zing_student')], auth);

export default router;
