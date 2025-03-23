/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('invoices_items', function (table) {
    table.uuid('invoice_id').notNullable();
    table.uuid('item_id').notNullable();

    // Add foreign key constraints
    table.foreign('invoice_id').references('alt_id').inTable('invoices');
    table.foreign('item_id').references('alt_id').inTable('items');

    // Add primary key
    table.primary(['invoice_id', 'item_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('invoices_items');
};
