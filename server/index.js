require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const velocityRoutes = require('./routes/velocityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Configure CORS BEFORE defining any routes
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true
}));

// 2. Middleware
app.use(express.json());

// 3. Routes (Mounted under /api/velocity so the full path becomes /api/velocity/analyze)
app.use('/api/velocity', velocityRoutes);

// 4. Database Connection & Server Startup
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));