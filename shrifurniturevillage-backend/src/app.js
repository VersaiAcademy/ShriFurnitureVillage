import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import productRoutes from './routes/products.routes.js';
import categoryRoutes from './routes/categories.routes.js';
import authRoutes from './routes/auth.routes.js';
import orderRoutes from './routes/orders.routes.js';

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
app.use(cors({ 
  origin: ['http://localhost:5173', 'http://localhost:5174', clientOrigin], 
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'shrifurniturevillage-backend' });
});

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
});

export default app;


