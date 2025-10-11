import { Router } from 'express';
import { adminLogin, createAdminIfMissing } from '../controllers/auth.controller.js';

const router = Router();

router.post('/admin/login', adminLogin);
router.post('/admin/seed', createAdminIfMissing); // one-time setup to create first admin

export default router;


