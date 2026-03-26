const express = require('express');
const initDb = require('./initDb');
const { testConnection } = require('./db');

const app = express();
app.use(express.json());

(async () => {
  await testConnection();
  await initDb();
})();

app.get('/', (req, res) => {
  res.send('API is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});