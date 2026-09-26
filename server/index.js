require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const velocityRoutes = require('./routes/velocityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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