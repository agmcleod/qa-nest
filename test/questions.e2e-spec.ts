import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { Connection } from 'typeorm'
import { BcryptService } from '../src/common/services/bcrypt.service'

import { Question } from '../src/questions/question.entity'
import { User } from '../src/users/user.entity'

import { cleanDb, createTestingModule, loginBeforeRequest } from './helpers'

describe('QuestionsResolver', () => {
  let app: INestApplication
  let connection: Connection
  let accessToken: string
  let userId: number

  beforeAll(async () => {
    const ref = await createTestingModule()
    app = ref.app
    connection = ref.connection
  })

  beforeEach(async () => {
    await cleanDb(connection)
    const login = await loginBeforeRequest(app, connection)
    accessToken = login.token
    userId = login.userId
  })

  afterAll(async () => {
    await app.close()
  })

  it('questions returns data from the db', async () => {
    await connection
      .createQueryBuilder()
      .insert()
      .into(Question)
      .values([
        {
          title: 'First Question',
          text: 'Question details',
          userId,
        },
        {
          title: 'Second Question',
          text: 'Question details',
          userId,
        },
      ])
      .execute()

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `{
          questions(offset: 0, limit: 10) {
            id,
            title,
            text
          }
        }`,
      })
      .then((res) => {
        expect(res.status).toEqual(200)
        expect(res.body.data.questions.length).toEqual(2)
      })
  })

  it('creates a new question', async () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          createQuestion(title: "New question", text: "Question body") {
            title,
            text
          }
        }`,
      })
      .then((res) => {
        expect(res.status).toEqual(200)
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `{
            questions(offset: 0, limit: 10) {
              id,
              title,
              text
            }
          }`,
          })
      })
      .then((res) => {
        expect(res.body.data.questions.length).toEqual(1)
      })
  })

  it('edit a question', async () => {
    const res = await connection
      .createQueryBuilder()
      .insert()
      .into(Question)
      .values({
        title: 'New Question',
        text: 'Question body',
        userId,
      })
      .returning(['id'])
      .execute()

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          updateQuestion(id: ${res.raw[0].id}, title: "Fixed title", text: "Fixed body") {
            title,
            text
          }
        }`,
      })
      .then((res) => {
        expect(res.status).toEqual(200)
        return request(app.getHttpServer())
          .post('/graphql')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            query: `{
            questions(offset: 0, limit: 10) {
              id,
              title,
              text
            }
          }`,
          })
      })
      .then((res) => {
        expect(res.body.data.questions.length).toEqual(1)
        expect(res.body.data.questions[0].title).toEqual('Fixed title')
        expect(res.body.data.questions[0].text).toEqual('Fixed body')
      })
  })

  it('cannot edit a question a user did not create', async () => {
    const bcryptService = new BcryptService()
    const userRes = await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({
        username: 'testuser',
        password: await bcryptService.hashString('mypassword'),
      })
      .returning(['id'])
      .execute()

    const res = await connection
      .createQueryBuilder()
      .insert()
      .into(Question)
      .values({
        title: 'New Question',
        text: 'Question body',
        userId: userRes.raw[0].id,
      })
      .returning(['id'])
      .execute()

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          updateQuestion(id: ${res.raw[0].id}, title: "Fixed title", text: "Fixed body") {
            title,
            text
          }
        }`,
      })
      .then((res) => {
        expect(res.status).toEqual(200)
        expect(res.body.errors[0].message).toEqual(
          'Cannot access this question',
        )
      })
  })
})
