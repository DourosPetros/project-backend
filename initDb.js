const { pool } = require('./db');

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const initDb = async () => {
  let retries = 5;

  while (retries) {
    try {
      console.log('⏳ Trying to connect to MySQL...');

      const query = `
        CREATE TABLE IF NOT EXISTS contacts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          phone VARCHAR(20) NOT NULL
        );
      `;

      await pool.query(query);

      console.log('✅ Table "contacts" created successfully (or already exists)');
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