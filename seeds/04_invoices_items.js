/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('invoices_items').del();

  // Get the alt_id values from the invoices table
  const invoices = await knex('invoices').select('alt_id');

  if (invoices.length < 3) {
    console.warn(
      'Not enough invoices in the database. Make sure to run the invoices seed first.',
    );
    return;
  }

  // Get the alt_id values from the items table
  const items = await knex('items').select('alt_id');

  if (items.length < 3) {
    console.warn(
      'Not enough items in the database. Make sure to run the items seed first.',
    );
    return;
  }

  // Inserts seed entries
  await knex('invoices_items').insert([
    {
      invoice_id: invoices[0].alt_id,
      item_id: items[0].alt_id,
    },
    {
      invoice_id: invoices[1].alt_id,
      item_id: items[1].alt_id,
    },
    {
      invoice_id: invoices[2].alt_id,
      item_id: items[2].alt_id,
    },
    // Add some additional relationships
    {
      invoice_id: invoices[0].alt_id,
      item_id: items[1].alt_id,
    },
    {
      invoice_id: invoices[1].alt_id,
      item_id: items[2].alt_id,
    },
  ]);
};
