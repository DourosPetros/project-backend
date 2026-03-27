const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { authMiddleware, requireAdmin } = require('../authMiddleware');

const router = express.Router();

// Get all users (admin only)
router.get('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, email, role, created_at FROM users');
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single user (admin only)
router.get('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [req.params.id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create user (admin only)
router.post('/', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email || null, hashedPassword, role]
    );

    res.status(201).json({
      id: result.insertId,
      username,
      email,
      role,
      message: 'User created successfully'
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only)
router.put('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const { username, email, role, password } = req.body;
    const userId = req.params.id;

    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    let updateQuery = 'UPDATE users SET username = ?, email = ?, role = ? WHERE id = ?';
    let params = [username, email || null, role, userId];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateQuery = 'UPDATE users SET username = ?, email = ?, role = ?, password = ? WHERE id = ?';
      params = [username, email || null, role, hashedPassword, userId];
    }

    const [result] = await pool.query(updateQuery, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
router.delete('/:id', authMiddleware, requireAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent deleting own account
    if (req.user.id === parseInt(userId)) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
