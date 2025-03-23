require('dotenv').config();
const knex = require('knex')({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST || 'lab1.local',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER || 'inventory',
    password: process.env.DATABASE_PASSWORD || 'secret',
    database: process.env.DATABASE_NAME || 'inventory',
  },
});

async function listTables() {
  try {
    // Query to get all tables in the public schema
    const tables = await knex.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('Tables in the database:');
    tables.rows.forEach((row) => {
      console.log(`- ${row.table_name}`);
    });

    // Exit after listing tables
    process.exit(0);
  } catch (error) {
    console.error('Error listing tables:', error);
    process.exit(1);
  }
}

listTables();
