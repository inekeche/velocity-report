require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const velocityRoutes = require('./routes/velocityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for development and production (Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  "https://velocity-report-f6ss.vercel.app" // Replace with your exact Vercel frontend URL if different
];

// 1. Configure CORS dynamically for production & local development
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// 2. Middleware
app.use(express.json());

// 3. Root health check route (helpful for verifying deployment status on Railway)
app.get('/', (req, res) => {
  res.send('Smart AI Velocity API is running successfully!');
});

// 4. Routes (Mounted under /api/velocity)
app.use('/api/velocity', velocityRoutes);

// 5. Database Connection & Server Startup
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));