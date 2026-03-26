const express = require('express');
const cors = require('cors');
const pool = require('./db');      
const initDb = require('./initDb'); 

const app = express();

// ✅ Middleware
// Δέχεται αιτήματα μόνο από το frontend σου
const allowedOrigin = 'https://frontend-production-f361.up.railway.app';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

// Για preflight requests (OPTIONS)
app.options('*', cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// ✅ Init DB
(async () => {
  try {
    await initDb();
    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ DB init error:', err);
  }
})();

// 📥 POST - Δημιουργία contact
app.post('/contacts', async (req, res) => {
  const { first_name, last_name, phone } = req.body;

  if (!first_name || !last_name || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO contacts (first_name, last_name, phone) VALUES (?, ?, ?)',
      [first_name, last_name, phone]
    );

    console.log('📥 New contact added:', { first_name, last_name, phone });

    res.status(201).json({ message: 'Contact saved', id: result.insertId });
  } catch (err) {
    console.error('❌ Insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 📤 GET - όλα τα contacts
app.get('/contacts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts');
    res.json(rows);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 🏠 Health check
app.get('/', (req, res) => res.send('API is running 🚀'));

// ▶️ Start server
const PORT = process.env.PORT || 8080; // Railway συνήθως χρησιμοποιεί 8080
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));