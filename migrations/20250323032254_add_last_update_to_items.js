/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Check if the items table exists
  const exists = await knex.schema.hasTable('items');

  if (exists) {
    // Check if the last_update column exists
    const hasLastUpdate = await knex.schema.hasColumn('items', 'last_update');

    if (!hasLastUpdate) {
      // Add the last_update column to the existing table
      return knex.schema.alterTable('items', function(table) {
        table
          .timestamp('last_update', { useTz: true })
          .notNullable()
          .defaultTo(knex.fn.now());
      });
    }
  }

  // If the table doesn't exist or the column already exists, return a resolved promise
  return Promise.resolve();
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.hasTable('items').then(exists => {
    if (exists) {
      return knex.schema.alterTable('items', function(table) {
        table.dropColumn('last_update');
      });
    }
    return Promise.resolve();
  });
};
