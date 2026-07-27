import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import app from './app.js';

// Verify critical env vars
const keyStatus = process.env.GEMINI_API_KEY
  ? `Loaded (${process.env.GEMINI_API_KEY.substring(0, 8)}...)`
  : 'MISSING';
console.log(`GEMINI_API_KEY: ${keyStatus}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`PORT: ${process.env.PORT}`);

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
