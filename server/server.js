const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. ADVANCED CORS SETUP
// This explicitly allows your React app to talk to the server
app.use(cors({
  origin: "http://localhost:5173", // Allow your specific frontend port
  methods: ["GET", "POST", "PUT", "DELETE"], // Allow these actions
  credentials: true // Allow cookies/tokens
}));

// 2. DEBUG MIDDLEWARE (Logs every request to the terminal)
app.use((req, res, next) => {
  console.log(`📡 Request received: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());

// DB Config
const db = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ DB Error:', err));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/roadmaps', require('./routes/roadmaps'))
app.use('/api/tasks', require('./routes/tasks'));;

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));