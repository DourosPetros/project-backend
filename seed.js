// seed.js - Database initialization script
// Runs once on first deployment to create all tables

const pool = require('./db');

const tables = {
  contacts: `
    CREATE TABLE IF NOT EXISTS contacts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `,
  
  tickets: `
    CREATE TABLE IF NOT EXISTS tickets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      status ENUM('open', 'in_progress', 'closed', 'on_hold') DEFAULT 'open',
      priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
      assigned_to VARCHAR(100),
      created_by VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      due_date DATE,
      category VARCHAR(100),
      INDEX idx_status (status),
      INDEX idx_priority (priority),
      INDEX idx_created_at (created_at),
      INDEX idx_assigned_to (assigned_to)
    );
  `,
  
  ticket_comments: `
    CREATE TABLE IF NOT EXISTS ticket_comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ticket_id INT NOT NULL,
      comment_text TEXT NOT NULL,
      created_by VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
      INDEX idx_ticket_id (ticket_id),
      INDEX idx_created_at (created_at)
    );
  `
};

const initializeDatabase = async () => {
  console.log('🔄 Starting database initialization...\n');
  
  try {
    for (const [tableName, createQuery] of Object.entries(tables)) {
      try {
        await pool.query(createQuery);
        console.log(`✅ Table "${tableName}" created or already exists`);
      } catch (err) {
        console.error(`❌ Error creating table "${tableName}":`, err.message);
        throw err;
      }
    }

    console.log('\n✅ Database initialization completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Database initialization failed:', err);
    process.exit(1);
  }
};

// Run initialization
initializeDatabase();
