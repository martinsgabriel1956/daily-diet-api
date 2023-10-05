import { Knex } from 'knex';

export async function up (knex: Knex): Promise<void> {
  return knex.schema.createTable('users', table => {
    table.uuid('id').primary();
    table.uuid('session_id').index();
    table.string('name').notNullable();
    table.string('email').notNullable().unique()
    table.string('avatar_url').nullable();
    table.integer('food_diet_percent').notNullable();
    table.integer('total_registered_food').nullable();
    table.integer('total_registered_diets_food').nullable();
    table.integer('total_registered_outside_diets_food').nullable();
    table.integer('better_sequence_diets_food').nullable();
  })
}


export async function down (knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}

