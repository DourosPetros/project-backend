const express = require('express');
const cors = require('cors');
const initDb = require('./initDb'); 
const contactsRoutes = require('./routes/contactsRoutes');
const ticketsRoutes = require('./routes/ticketsRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

// ✅ Πιο αυστηρό και ασφαλές CORS για Production
app.use(cors({
  origin: [
    'https://frontend-production-f361.up.railway.app', // Το live link σου
    'http://localhost:3000'                           // Για να μπορείς να δουλεύεις και τοπικά
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
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
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);
app.use('/contacts', contactsRoutes);
app.use('/tickets', ticketsRoutes);

// Health check
app.get('/', (req, res) => res.send('API is running 🚀'));

// Start server
// Στη Railway είναι ΚΡΙΣΙΜΟ να χρησιμοποιείς το process.env.PORT
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});