/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Check if the items table exists
  const exists = await knex.schema.hasTable('items');

  // Only create the table if it doesn't exist
  if (!exists) {
    return knex.schema.createTable('items', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.integer('quantity').notNullable().defaultTo(0);
      table.decimal('price', 10, 2);
      table.timestamps(true, true);
    });
  }

  // If the table already exists, return a resolved promise
  return Promise.resolve();
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('items');
}
