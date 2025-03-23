/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Check if the items table exists
  const exists = await knex.schema.hasTable('items');

  if (exists) {
    // Drop the existing table and recreate it with the correct schema
    await knex.schema.dropTable('items');
  }

  // Create the items table with the correct schema
  return knex.schema.createTable('items', function (table) {
    table.increments('id').primary();
    table.uuid('alt_id').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.text('description').notNullable();
    table.decimal('unit_price', 15, 2).notNullable();
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

    // Add indices
    table.unique(['alt_id']);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // Drop the new items table
  return knex.schema.dropTable('items').then(function () {
    // Recreate the original items table
    return knex.schema.createTable('items', function (table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description');
      table.integer('quantity').notNullable().defaultTo(0);
      table.decimal('price', 10, 2);
      table.timestamps(true, true);
    });
  });
};
