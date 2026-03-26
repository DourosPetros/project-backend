const express = require('express');
const pool = require('./db');
const initDb = require('./initDb');

const app = express();
app.use(express.json());

// 👉 Εκκίνηση DB init
initDb();

app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ time: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Database error');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});