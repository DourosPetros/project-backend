const express = require('express');
const cors = require('cors');
const initDb = require('./initDb'); 
const contactsRoutes = require('./routes/contactsRoutes'); // νέο routes αρχείο

const app = express();

// Middleware CORS για frontend
const allowedOrigin = 'https://frontend-production-f361.up.railway.app';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST'],
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
app.use('/contacts', contactsRoutes); // όλα τα GET/POST για contacts εδώ

// Health check
app.get('/', (req, res) => res.send('API is running 🚀'));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));