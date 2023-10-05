import { FastifyInstance } from 'fastify';
import crypto from 'node:crypto';
import { z as zod } from 'zod';
import { knex } from '../database';
import { checkSessionIdExists } from '../middleware/checkSessionIdExists';

export async function userRoutes (app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const bodySchema = zod.object({
      name: zod.string(),
      email: zod.string(),
      avatarUrl: zod.string().nullable(),
      foodDietPercent: zod.number()
    })

    const { avatarUrl, name, email, foodDietPercent } = bodySchema.parse(request.body);

    const sessionId = crypto.randomUUID()

    const isUserExists = await knex('users').where({
      email
    });

    if (isUserExists && isUserExists.length > 0) {
      return reply.status(400).send({
        error: 'User already exists'
      })
    }

    await knex('users').insert({
      id: crypto.randomUUID(),
      name,
      email,
      avatar_url: avatarUrl,
      food_diet_percent: foodDietPercent,
      session_id: sessionId
    })

    reply.setCookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return reply.status(201).send({
      message: 'User created'
    })
  })

  app.get('/', async (request, reply) => {
    const user = await knex('users').select(['id', 'name', 'email', 'avatar_url', 'food_diet_percent']);
    return reply.status(200).send(user);
  })

  app.get('/statistics', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const { sessionId } = request.cookies;

    const allFood = await knex('diets').where({
      session_id: sessionId
    })

    const allDietsFood = allFood.filter((diet) => Boolean(diet.is_diet_or_not));
    const allNotDietsFood = allFood.filter((diet) => !diet.is_diet_or_not);

    await knex('users').where({
      session_id: sessionId
    }).update({
      total_registered_food: allFood.length,
      total_registered_diets_food: allDietsFood.length,
      total_registered_outside_diets_food: allNotDietsFood.length
    })
  })
}
