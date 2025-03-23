/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Check if the invoices_items table exists
  const exists = await knex.schema.hasTable('invoices_items');

  // Only create the table if it doesn't exist
  if (!exists) {
    return knex.schema.createTable('invoices_items', function (table) {
      table.uuid('invoice_id').notNullable();
      table.uuid('item_id').notNullable();

      // Add foreign key constraints
      table.foreign('invoice_id').references('alt_id').inTable('invoices');
      table.foreign('item_id').references('alt_id').inTable('items');

      // Add primary key
      table.primary(['invoice_id', 'item_id']);
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
  return knex.schema.dropTable('invoices_items');
};
