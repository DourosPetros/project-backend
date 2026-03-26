// seed.js - Database initialization script
// Runs once on first deployment to create all tables

const pool = require('./db');

const initDb = async () => {
  try {
    console.log('🚀 Starting database initialization...');

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

    const tables = {
      contacts: `
        CREATE TABLE IF NOT EXISTS contacts (
          id SERIAL PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `,

      tickets: `
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
      `,

      ticket_comments: `
        CREATE TABLE IF NOT EXISTS ticket_comments (
          id SERIAL PRIMARY KEY,
          ticket_id INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
          comment_text TEXT NOT NULL,
          created_by VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    };

    // Create indexes
    const indexes = `
      CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
      CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
      CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);
      CREATE INDEX IF NOT EXISTS idx_tickets_assigned_to ON tickets(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
      CREATE INDEX IF NOT EXISTS idx_ticket_comments_created_at ON ticket_comments(created_at);
    `;

    // Execute table creation
    for (const [tableName, query] of Object.entries(tables)) {
      console.log(`📋 Creating table: ${tableName}`);
      await pool.query(query);
    }

    // Create indexes
    console.log('📋 Creating indexes...');
    await pool.query(indexes);

    console.log('✅ Database initialized successfully!');
    console.log('📊 Tables created: contacts, tickets, ticket_comments');

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

// Run if called directly
if (require.main === module) {
  initDb();
}

module.exports = initDb;

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
