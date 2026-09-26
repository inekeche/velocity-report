require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const velocityRoutes = require('./routes/velocityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Allowed origins for development and production
const allowedOrigins = [
  "http://localhost:5173",
  "https://velocity-frontend-10a8.onrender.com"
];

// Configure CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    } else {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Parse incoming JSON
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/velocity', velocityRoutes);

app.get('/', (req, res) => {
  res.send('Smart AI Velocity API is running successfully!');
});

// Connect to MongoDB & Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));