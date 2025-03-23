/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('items').del();

  // Inserts seed entries
  await knex('items').insert([
    {
      name: 'Laptop',
      description: 'High-performance laptop for developers',
      unit_price: 1299.99,
      created_by: 'system',
    },
    {
      name: 'Smartphone',
      description: 'Latest model smartphone with advanced features',
      unit_price: 899.99,
      created_by: 'system',
    },
    {
      name: 'Headphones',
      description: 'Noise-cancelling wireless headphones',
      unit_price: 249.99,
      created_by: 'system',
    },
  ]);
};
