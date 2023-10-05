import { describe, it, afterAll, beforeAll, beforeEach, expect } from 'vitest';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';

describe('Diet Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('Should be able to create a new diet', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      id: crypto.randomUUID(),
      name: 'John Doe',
      email: '4Hg1G@example.com',
      avatarUrl: 'https://github.com/johndoe.png',
      foodDietPercent: 0
    }).expect(201)

    const cookies = createUserResponse.get('Set-Cookie');

    await request(app.server).post('/diets').set('Cookie', cookies).send({
      name: 'New Diet',
      description: 'New Description',
      date: '2022-12-12',
      hour: '12:00',
      isDietOrNot: true
    }).expect(201)
  })

  it("Shouldn't be able to create a new diet if session id doesn't exist", async () => {
    await request(app.server).post('/diets').send({
      name: 'New Diet',
      description: 'New Description',
      date: '2022-12-12',
      hour: '12:00',
      isDietOrNot: true
    }).expect(401)
  })

  it('Should be able to update a diet', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      id: crypto.randomUUID(),
      name: 'John Doe',
      email: '4Hg1G@example.com',
      avatarUrl: 'https://github.com/johndoe.png',
      foodDietPercent: 0
    }).expect(201)

    const cookies = createUserResponse.get('Set-Cookie');

    await request(app.server).post('/diets').set('Cookie', cookies).send({
      name: 'New Diet',
      description: 'New Description',
      date: '2022-12-12',
      hour: '12:00',
      isDietOrNot: true
    }).expect(201)

    const listDietsResponse = await request(app.server).get('/diets').set('Cookie', cookies).expect(200);

    const dietId = listDietsResponse.body[0].id;

    await request(app.server)
      .put(`/diets/${dietId}`)
      .set('Cookie', cookies)
      .send({
        name: 'New Name2',
        description: 'New Description2',
        date: '2022/07/08',
        hour: '08:00',
        isDietOrNot: false
      })
      .expect(204)
  })
})
