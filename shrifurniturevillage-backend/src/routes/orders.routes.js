import { Router } from 'express';
import { listOrders, createOrder } from '../controllers/orders.controller.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAdmin, listOrders);
router.post('/', createOrder); // customer places order

export default router;


