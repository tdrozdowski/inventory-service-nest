/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  // Check if the items table exists
  const exists = await knex.schema.hasTable('items');

  if (exists) {
    // Check if the alt_id column exists
    const hasAltId = await knex.schema.hasColumn('items', 'alt_id');

    if (!hasAltId) {
      // Add the alt_id column to the existing table
      await knex.schema.alterTable('items', function(table) {
        table.uuid('alt_id').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
        table.unique(['alt_id']);
      });
    }

    // Check if other required columns exist and add them if they don't
    const hasUnitPrice = await knex.schema.hasColumn('items', 'unit_price');
    const hasCreatedBy = await knex.schema.hasColumn('items', 'created_by');
    const hasLastChangedBy = await knex.schema.hasColumn('items', 'last_changed_by');

    if (!hasUnitPrice || !hasCreatedBy || !hasLastChangedBy) {
      await knex.schema.alterTable('items', function(table) {
        if (!hasUnitPrice) {
          table.decimal('unit_price', 15, 2).notNullable().defaultTo(0);
        }
        if (!hasCreatedBy) {
          table.text('created_by').notNullable().defaultTo('system');
        }
        if (!hasLastChangedBy) {
          table.text('last_changed_by').notNullable().defaultTo('system');
        }
      });
    }

    return Promise.resolve();
  } else {
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
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
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
