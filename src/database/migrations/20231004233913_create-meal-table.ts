import { Knex } from 'knex';

export async function up (knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', table => {
    table.uuid('id').primary();
    table.uuid('session_id').index();
    table.string('name').notNullable();
    table.string('description').notNullable();
    table.timestamp('date', {
      useTz: true
    }).notNullable();
    table.timestamps(false, true);
    table.boolean('is_diet_or_not').notNullable();
  });
}


export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals')
}

