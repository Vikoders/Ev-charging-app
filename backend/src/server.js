require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || '';

const configuredOrigins = CLIENT_URL.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultDevOrigins = [
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

const allowedOrigins = new Set([...defaultDevOrigins, ...configuredOrigins]);

connectDB();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || origin === 'null') {
      callback(null, true);
      return;
    }

    if (configuredOrigins.includes('*') || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('/{*path}', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: '⚡ EV Charging API is running',
    endpoints: {
      auth: '/api/auth',
      stations: '/api/stations'
    }
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/stations', require('./routes/stations'));

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
