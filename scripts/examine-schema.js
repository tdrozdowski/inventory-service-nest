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

async function examineSchema() {
  try {
    // Get list of tables (excluding the SQLx migrations table)
    const tables = await knex.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name != '_sqlx_migrations'
      ORDER BY table_name;
    `);

    // For each table, get column information
    for (const { table_name } of tables.rows) {
      console.log(`\n=== TABLE: ${table_name} ===`);

      // Get column information
      const columns = await knex.raw(
        `
        SELECT 
          column_name, 
          data_type, 
          character_maximum_length,
          column_default, 
          is_nullable
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = ?
        ORDER BY ordinal_position;
      `,
        [table_name],
      );

      console.log('Columns:');
      columns.rows.forEach((col) => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default
          ? `DEFAULT ${col.column_default}`
          : '';
        const maxLength = col.character_maximum_length
          ? `(${col.character_maximum_length})`
          : '';
        console.log(
          `  - ${col.column_name}: ${col.data_type}${maxLength} ${nullable} ${defaultVal}`,
        );
      });

      // Get primary key information
      const primaryKeys = await knex.raw(
        `
        SELECT 
          kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public'
        AND tc.table_name = ?
        AND tc.constraint_type = 'PRIMARY KEY';
      `,
        [table_name],
      );

      if (primaryKeys.rows.length > 0) {
        console.log('Primary Key:');
        primaryKeys.rows.forEach((pk) => {
          console.log(`  - ${pk.column_name}`);
        });
      }

      // Get foreign key information
      const foreignKeys = await knex.raw(
        `
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
        WHERE tc.table_schema = 'public'
        AND tc.table_name = ?
        AND tc.constraint_type = 'FOREIGN KEY';
      `,
        [table_name],
      );

      if (foreignKeys.rows.length > 0) {
        console.log('Foreign Keys:');
        foreignKeys.rows.forEach((fk) => {
          console.log(
            `  - ${fk.column_name} -> ${fk.foreign_table_name}(${fk.foreign_column_name})`,
          );
        });
      }

      // Get index information
      const indices = await knex.raw(
        `
        SELECT
          indexname,
          indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
        AND tablename = ?;
      `,
        [table_name],
      );

      if (indices.rows.length > 0) {
        console.log('Indices:');
        indices.rows.forEach((idx) => {
          console.log(`  - ${idx.indexname}: ${idx.indexdef}`);
        });
      }
    }

    // Exit after examining schema
    process.exit(0);
  } catch (error) {
    console.error('Error examining schema:', error);
    process.exit(1);
  }
}

examineSchema();
