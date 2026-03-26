// routes/ticketsRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // MySQL pool

// ==================== TICKETS CRUD ====================

// GET - Όλα τα tickets με filtering
router.get('/', async (req, res) => {
  try {
    const { status, priority, assigned_to } = req.query;
    let query = 'SELECT * FROM tickets WHERE 1=1';
    const params = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }
    if (assigned_to) {
      query += ' AND assigned_to = ?';
      params.push(assigned_to);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET - Ένα συγκεκριμένο ticket
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM tickets WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const ticket = rows[0];

    // Ανάκτηση σχολίων
    const [comments] = await pool.query(
      'SELECT * FROM ticket_comments WHERE ticket_id = ? ORDER BY created_at DESC',
      [id]
    );

    res.json({ ...ticket, comments });
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST - Δημιουργία νέου ticket
router.post('/', async (req, res) => {
  const { title, description, priority, assigned_to, created_by, due_date, category } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO tickets (title, description, priority, assigned_to, created_by, due_date, category, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'open')`,
      [title, description || null, priority || 'medium', assigned_to || null, created_by || 'Anonymous', due_date || null, category || null]
    );

    console.log('📥 New ticket created:', { title, id: result.insertId });
    res.status(201).json({ 
      message: 'Ticket created successfully',
      id: result.insertId,
      ticket_id: result.insertId
    });
  } catch (err) {
    console.error('❌ Insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT - Ενημέρωση ticket
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, assigned_to, due_date, category } = req.body;

  try {
    // Έλεγχος αν υπάρχει το ticket
    const [rows] = await pool.query('SELECT id FROM tickets WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      params.push(status);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }
    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assigned_to);
    }
    if (due_date !== undefined) {
      updates.push('due_date = ?');
      params.push(due_date);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      params.push(category);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const query = `UPDATE tickets SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await pool.query(query, params);

    console.log('✏️ Ticket updated:', { id });
    res.json({ message: 'Ticket updated successfully' });
  } catch (err) {
    console.error('❌ Update error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE - Διαγrafή ticket
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM tickets WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    console.log('🗑️ Ticket deleted:', { id });
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ==================== COMMENTS ====================

// POST - Προσθήκη σχολίου σε ticket
router.post('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { comment_text, created_by } = req.body;

  if (!comment_text) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  try {
    // Έλεγχος αν υπάρχει το ticket
    const [ticket] = await pool.query('SELECT id FROM tickets WHERE id = ?', [id]);
    if (ticket.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const [result] = await pool.query(
      'INSERT INTO ticket_comments (ticket_id, comment_text, created_by) VALUES (?, ?, ?)',
      [id, comment_text, created_by || 'Anonymous']
    );

    console.log('💬 Comment added to ticket:', { ticket_id: id, comment_id: result.insertId });
    res.status(201).json({ 
      message: 'Comment added successfully',
      comment_id: result.insertId
    });
  } catch (err) {
    console.error('❌ Insert error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET - Σχόλια ticket (ήδη στο /:id route αλλά όπως χρειάζεται)
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const [comments] = await pool.query(
      'SELECT * FROM ticket_comments WHERE ticket_id = ? ORDER BY created_at DESC',
      [id]
    );
    res.json(comments);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE - Διαγrafή σχολίου
router.delete('/comments/:comment_id', async (req, res) => {
  const { comment_id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM ticket_comments WHERE id = ?', [comment_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    console.log('🗑️ Comment deleted:', { comment_id });
    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    console.error('❌ Delete error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ==================== STATS ====================

// GET - Στατιστικά tickets
router.get('/stats/summary', async (req, res) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open_count,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed_count,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent_count
      FROM tickets
    `);
    res.json(stats[0]);
  } catch (err) {
    console.error('❌ Fetch error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;
