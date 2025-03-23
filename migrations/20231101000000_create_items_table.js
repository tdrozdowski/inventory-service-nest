/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('items', function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.integer('quantity').notNullable().defaultTo(0);
    table.decimal('price', 10, 2);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('items');
};
