const db = require('./db');

async function initializeDatabase() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(100) UNIQUE,
        password VARCHAR(255)
      )
    `);
    console.log('Users table created successfully.');
  } catch (err) {
    console.error('Error creating users table:', err);
  } finally {
    process.exit();
  }
}

initializeDatabase();