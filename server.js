const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mayscentral';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import Models
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const Waitlist = require('./models/Waitlist');

// Import Routes
const apiRoutes = require('./routes/api');

// Routes
app.use('/api', apiRoutes);

// Serve registration page
app.get('/events/:eventId/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'MaysCentral API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MaysCentral server running on http://localhost:${PORT}`);
  console.log(`📝 Registration page: http://localhost:${PORT}/events/:eventId/register`);
});

