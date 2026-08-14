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

app.use(cors({
  origin: function (origin, callback) {
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

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Smart AI Velocity API is running successfully!');
});

app.use('/api/velocity', velocityRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected Successfully');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));