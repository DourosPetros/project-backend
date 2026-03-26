const pool = require('./db');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initDb = async () => {
  let retries = 5;

  while (retries) {
    try {
      console.log('⏳ Trying to connect to DB...');

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
      break;

    } catch (err) {
      console.error('❌ DB not ready, retrying...', err.code);

      retries--;
      await wait(5000);
    }
  }

  if (!retries) {
    console.error('❌ Could not connect to DB after retries');
  }
};

module.exports = initDb;