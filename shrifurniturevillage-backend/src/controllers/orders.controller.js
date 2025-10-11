import Order from '../models/Order.js';

export async function listOrders(req, res) {
  const orders = await Order.find({}).populate('items.product').sort('-createdAt');
  res.json(orders);
}

export async function createOrder(req, res) {
  const { userId, items, shippingAddress, notes } = req.body;
  if (!userId || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Invalid order payload' });
  }
  const totalAmount = items.reduce((sum, i) => sum + (i.priceAtPurchase * i.quantity), 0);
  const order = await Order.create({ userId, items, totalAmount, shippingAddress, notes });
  res.status(201).json(order);
}


