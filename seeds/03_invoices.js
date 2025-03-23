/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('invoices').del();

  // Get the alt_id values from the persons table
  const persons = await knex('persons').select('alt_id');

  if (persons.length < 3) {
    console.warn(
      'Not enough persons in the database. Make sure to run the persons seed first.',
    );
    return;
  }

  // Inserts seed entries
  await knex('invoices').insert([
    {
      total: 1299.99,
      paid: false,
      user_id: persons[0].alt_id,
      created_by: 'system',
    },
    {
      total: 899.99,
      paid: true,
      user_id: persons[1].alt_id,
      created_by: 'system',
    },
    {
      total: 249.99,
      paid: false,
      user_id: persons[2].alt_id,
      created_by: 'system',
    },
  ]);
};
