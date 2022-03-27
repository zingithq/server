import { Router } from 'express';

import { auth } from './user.controllers';

const router = Router();

router.post('/auth', auth);

export default router;
