// routes/contactsRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // MySQL pool

// POST - Δημιουργία contact
router.post('/', async (req, res) => {
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

// GET - όλα τα contacts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM contacts');
    res.json(rows);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;