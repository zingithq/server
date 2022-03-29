import { Router } from 'express';

import verifyToken from '../../middlewares/verifyJwt';
import { auth, loggedUser } from './user.controllers';

const router = Router();

// TODO: Add routes for last login time and last logout timestamp

router.post('/auth', auth);
router.get('/user', [verifyToken], loggedUser);

export default router;
