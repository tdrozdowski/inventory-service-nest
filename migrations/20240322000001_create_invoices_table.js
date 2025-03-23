/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Check if the invoices table exists
  const exists = await knex.schema.hasTable('invoices');

  // Only create the table if it doesn't exist
  if (!exists) {
    return knex.schema.createTable('invoices', function (table) {
      table.increments('id').primary();
      table.uuid('alt_id').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
      table.decimal('total', 15, 2).notNullable();
      table.boolean('paid').notNullable().defaultTo(false);
      table.text('created_by').notNullable();
      table
        .timestamp('created_at', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
      table
        .timestamp('last_update', { useTz: true })
        .notNullable()
        .defaultTo(knex.fn.now());
      table.text('last_changed_by').notNullable().defaultTo('system');
      table.uuid('user_id').notNullable();

      // Add foreign key constraint
      table.foreign('user_id').references('alt_id').inTable('persons');

      // Add indices
      table.unique(['alt_id']);
    });
  }

  // If the table already exists, return a resolved promise
  return Promise.resolve();
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable('invoices');
};
