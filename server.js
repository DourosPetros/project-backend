const express = require('express');
const cors = require('cors');
const initDb = require('./initDb'); 
const contactsRoutes = require('./routes/contactsRoutes');
const ticketsRoutes = require('./routes/ticketsRoutes');

const app = express();

// Middleware CORS για frontend
const allowedOrigin = process.env.FRONTEND_URL || 'https://frontend-production-f361.up.railway.app';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Init DB
(async () => {
  try {
    await initDb();
    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ DB init error:', err);
  }
})();

// 🔹 Routes
app.use('/contacts', contactsRoutes);
app.use('/tickets', ticketsRoutes);

// Health check
app.get('/', (req, res) => res.send('API is running 🚀'));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));