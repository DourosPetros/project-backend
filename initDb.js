const pool = require('./db');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initDb = async () => {
  let retries = 5;

  while (retries) {
    try {
      console.log('⏳ Trying to connect to MySQL...');

      // Create contacts table
      const contactsQuery = `
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL
        );
      `;

      // Create tickets table
      const ticketsQuery = `
        CREATE TABLE IF NOT EXISTS tickets (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status ENUM('open', 'in_progress', 'stuck', 'closed') DEFAULT 'open',
          priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
          assigned_to VARCHAR(100),
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          due_date DATE,
          category VARCHAR(100),
          INDEX idx_status (status),
          INDEX idx_priority (priority),
          INDEX idx_created_at (created_at)
        );
      `;

      // Create ticket comments table
      const commentsQuery = `
        CREATE TABLE IF NOT EXISTS ticket_comments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          ticket_id INT NOT NULL,
          comment_text TEXT NOT NULL,
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
          INDEX idx_ticket_id (ticket_id)
        );
      `;

      // Create users table
      const usersQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(100),
          role ENUM('admin', 'user') DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_username (username),
          INDEX idx_role (role)
        );
      `;

      await pool.query(contactsQuery);
      await pool.query(ticketsQuery);
      await pool.query(commentsQuery);
      await pool.query(usersQuery);

      console.log('✅ Database tables created successfully (or already exist)');
      break;

    } catch (err) {
      console.error('❌ MySQL not ready, retrying...', err.code);
      retries--;
      await wait(5000);
    }
  }

  if (!retries) {
    console.error('❌ Could not connect to MySQL after retries');
  }
};

module.exports = initDb;