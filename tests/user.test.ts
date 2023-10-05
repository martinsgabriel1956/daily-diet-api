import { describe, it, afterAll, beforeAll, beforeEach, expect } from 'vitest';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';
import request from 'supertest';
import { app } from '../src/app';

describe('User Routes', () => {
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

  it('Should be able to create a new user', async () => {
    await request(app.server).post('/users').send({
      id: crypto.randomUUID(),
      name: 'John Doe',
      email: '4Hg1G@example.com',
      avatarUrl: 'https://github.com/johndoe.png',
      foodDietPercent: 0
    }).expect(201)
  })

  it("Shouldn't be able to create a new user with an existing email", async () => {
    await request(app.server).post('/users').send({
      id: crypto.randomUUID(),
      name: 'John Doe',
      email: '4Hg1G@example.com',
      avatarUrl: 'https://github.com/johndoe.png',
      foodDietPercent: 0
    }).expect(201);

    await request(app.server).post('/users').send({
      id: crypto.randomUUID(),
      name: 'John Doe',
      email: '4Hg1G@example.com',
      avatarUrl: 'https://github.com/johndoe.png',
      foodDietPercent: 0
    }).expect(400);
  })

  it('Should be able to list all users', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      id: crypto.randomUUID(),
      name: 'John Doe',
      email: '4Hg1G@example.com',
      avatarUrl: 'https://github.com/johndoe.png',
      foodDietPercent: 0
    }).expect(201)

    const cookies = createUserResponse.get('Set-Cookie');

    const listUsersResponse = await request(app.server)
      .get('/users')
      .set('Cookie', cookies)
      .expect(200)

    expect(listUsersResponse.body).toEqual([
      expect.objectContaining({
        name: 'John Doe',
        email: '4Hg1G@example.com'
      })
    ])
  })
})


