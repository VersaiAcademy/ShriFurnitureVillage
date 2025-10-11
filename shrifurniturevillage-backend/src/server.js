import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import express from 'express';
import app from './app.js';
import { connectDb } from './config/db.js';

const port = process.env.PORT || 5000;

// ✅ Add a simple route to respond at the root URL
app.get('/', (req, res) => {
  res.send('API is running successfully');
});

async function bootstrap() {
  await connectDb();

  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(`✅ API listening on http://localhost:${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('❌ Fatal startup error', err);
  process.exit(1);
});