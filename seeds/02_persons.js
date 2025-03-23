/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('persons').del();

  // Inserts seed entries
  await knex('persons').insert([
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      created_by: 'system',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      created_by: 'system',
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      created_by: 'system',
    },
  ]);
};
