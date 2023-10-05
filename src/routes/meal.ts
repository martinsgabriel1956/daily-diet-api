import { FastifyInstance } from 'fastify';
import crypto from 'node:crypto';
import { z as zod } from 'zod';
import { knex } from '../database';
import { checkSessionIdExists } from '../middleware/checkSessionIdExists';
import { formatDate } from '../utils/formatDate';
import { isResourceExists } from '../utils/isResourceExists';

export async function mealRoutes (app: FastifyInstance) {
  app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const { sessionId } = request.cookies;

    const diets = await knex('diets').select(['id', 'name', 'description', 'date', 'is_diet_or_not', 'created_at', 'updated_at']).where({
      session_id: sessionId
    })

    return reply.status(200).send(diets);
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const paramsSchema = zod.object({
      id: zod.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params);
    const { sessionId } = request.cookies;

    const isDietExists = await isResourceExists({
      resourceId: id,
      sessionId,
      tableName: 'diets'
    })

    if (!isDietExists) {
      return reply.status(404).send({
        error: 'Diet not found'
      })
    }

    const diet = await knex('diets').select(['id', 'name', 'description', 'date', 'is_diet_or_not', 'created_at', 'updated_at']).where({
      id,
      session_id: sessionId
    }).first();

    return reply.status(200).send(diet);
  })

  app.post('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const bodySchema = zod.object({
      name: zod.string(),
      description: zod.string(),
      date: zod.string(),
      hour: zod.string(),
      isDietOrNot: zod.boolean()
    })

    const { name, description, date, hour, isDietOrNot } = bodySchema.parse(request.body);
    const { sessionId } = request.cookies;
    const formattedDate = formatDate({ date, hour });

    await knex('diets').insert({
      id: crypto.randomUUID(),
      name,
      description,
      date: formattedDate,
      is_diet_or_not: isDietOrNot,
      session_id: sessionId
    })

    return reply.status(201).send({
      message: 'Diet created'
    })
  })

  app.put('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const bodySchema = zod.object({
      name: zod.string(),
      description: zod.string(),
      date: zod.string(),
      hour: zod.string(),
      isDietOrNot: zod.boolean()
    })

    const paramsSchema = zod.object({
      id: zod.string().uuid()
    })

    const { name, description, date, hour, isDietOrNot } = bodySchema.parse(request.body);
    const { id } = paramsSchema.parse(request.params);
    const { sessionId } = request.cookies;
    const formattedDate = formatDate({ date, hour });

    const isDietExists = await isResourceExists({
      resourceId: id,
      sessionId,
      tableName: 'diets'
    })

    if (!isDietExists) {
      return reply.status(404).send({
        error: 'Diet not found'
      })
    }

    await knex('diets').where({
      id,
      session_id: sessionId
    }).update({
      name,
      description,
      date: formattedDate,
      is_diet_or_not: isDietOrNot
    })

    return reply.status(204).send({
      message: 'Diet updated'
    })
  })

  app.delete('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const paramsSchema = zod.object({
      id: zod.string().uuid()
    })

    const { id } = paramsSchema.parse(request.params);
    const { sessionId } = request.cookies;

    const isDietExists = await isResourceExists({
      resourceId: id,
      sessionId,
      tableName: 'diets'
    })

    if (!isDietExists) {
      return reply.status(404).send({
        error: 'Diet not found'
      })
    }

    await knex('diets').where({
      id,
      session_id: sessionId
    }).delete()

    return reply.status(204).send({
      message: 'Diet deleted'
    })
  })
}
