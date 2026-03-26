const pool = require('./db');

const initDb = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL
      );
    `;

    await pool.query(createTableQuery);

    console.log('✅ Table "contacts" is ready (created if not exists)');
  } catch (err) {
    console.error('❌ Error creating table:', err);
  }
};

module.exports = initDb;