const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.MYSQLHOST || 'db',
  user: process.env.MYSQLUSER || 'postgres',
  password: process.env.MYSQLPASSWORD || 'postgres',
  database: process.env.MYSQLDATABASE || 'mydatabase',
  port: process.env.MYSQLPORT || 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;