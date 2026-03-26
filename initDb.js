const pool = require('./db');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initDb = async () => {
  let retries = 5;

  while (retries) {
    try {
      console.log('⏳ Trying to connect to PostgreSQL...');

      // Create custom types for enums
      await pool.query(`
        DO $$ BEGIN
          CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'closed', 'on_hold');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      await pool.query(`
        DO $$ BEGIN
          CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');
        EXCEPTION
          WHEN duplicate_object THEN null;
        END $$;
      `);

      // Create contacts table
      const contactsQuery = `
        CREATE TABLE IF NOT EXISTS contacts (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL
        );
      `;

      // Create tickets table
      const ticketsQuery = `
        CREATE TABLE IF NOT EXISTS tickets (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          status ticket_status DEFAULT 'open',
          priority ticket_priority DEFAULT 'medium',
          assigned_to VARCHAR(100),
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          due_date DATE,
          category VARCHAR(100)
        );
      `;

      // Create indexes for tickets
      const ticketsIndexes = `
        CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
        CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
        CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
      `;

      // Create ticket comments table
      const commentsQuery = `
        CREATE TABLE IF NOT EXISTS ticket_comments (
          id SERIAL PRIMARY KEY,
          ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
          comment_text TEXT NOT NULL,
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Create index for comments
      const commentsIndex = `
        CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
      `;

      await pool.query(contactsQuery);
      await pool.query(ticketsQuery);
      await pool.query(ticketsIndexes);
      await pool.query(commentsQuery);
      await pool.query(commentsIndex);

      console.log('✅ Database tables created successfully (or already exist)');
      break;

    } catch (err) {
      console.error('❌ PostgreSQL not ready, retrying...', err.message);
      retries--;
      await wait(5000);
    }
  }

  if (!retries) {
    console.error('❌ Could not connect to PostgreSQL after retries');
  }
};

module.exports = initDb;