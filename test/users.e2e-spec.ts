import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { Connection } from 'typeorm'

import { cleanDb, createTestingModule } from './helpers'

describe('UsersController (e2e)', () => {
  let app: INestApplication
  let connection: Connection

  beforeAll(async () => {
    const ref = await createTestingModule()
    app = ref.app
    connection = ref.connection
  })

  beforeEach(async () => {
    await cleanDb(connection)
  })

  afterAll(async () => {
    await app.close()
  })

  it('can register a user', async () => {
    return request(app.getHttpServer())
      .post('/users/register')
      .send({
        username: 'testuser',
        password: 'mytestpassword',
      })
      .expect(201)
  })
})
