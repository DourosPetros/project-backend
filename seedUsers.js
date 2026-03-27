const bcrypt = require('bcrypt');
const pool = require('./db');

const seedUsers = async () => {
  try {
    console.log('🌱 Seeding admin user...');

    // Check if admin exists
    const [existing] = await pool.query("SELECT id FROM users WHERE username = ?", ['admin']);
    
    if (existing.length > 0) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert admin user
    await pool.query(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
      ['admin', hashedPassword, 'admin@ticketsystem.com', 'admin']
    );

    console.log('✅ Admin user created successfully');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   ⚠️ IMPORTANT: Change this password after first login!');
  } catch (err) {
    console.error('❌ Error seeding users:', err);
  }
};

seedUsers();
