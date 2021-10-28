import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { Connection } from 'typeorm'
import { BcryptService } from '../src/common/services/bcrypt.service'

import { Comment } from '../src/comments/comment.entity'
import { Question } from '../src/questions/question.entity'
import { User } from '../src/users/user.entity'

import { cleanDb, createTestingModule, loginBeforeRequest } from './helpers'

describe('CommentsResolver', () => {
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

  async function createQuestion() {
    const question = await connection
      .createQueryBuilder()
      .insert()
      .into(Question)
      .values({
        title: 'My Question',
        text: 'A question',
        userId,
      })
      .returning(['id'])
      .execute()

    return question.raw[0].id
  }

  it('comments returns data from the db', async () => {
    const questionId = await createQuestion()

    await connection
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values([
        {
          text: 'Question details',
          userId,
          questionId,
        },
        {
          text: 'Question details',
          userId,
          questionId,
        },
      ])
      .execute()

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `{
          comments(questionId: ${questionId}) {
            id,
            text
          }
        }`,
      })
      .then((res) => {
        expect(res.status).toEqual(200)
        expect(res.body.data.comments.length).toEqual(2)
      })
  })

  it('creates a new comment', async () => {
    const questionId = await createQuestion()

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          createComment(questionId: ${questionId}, text: "Question body") {
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
              comments(questionId: ${questionId}) {
                id,
                text
              }
            }`,
          })
      })
      .then((res) => {
        expect(res.body.data.comments.length).toEqual(1)
      })
  })

  it('edit a comment', async () => {
    const questionId = await createQuestion()
    const res = await connection
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values({
        text: 'Comment body',
        userId,
        questionId,
      })
      .returning(['id'])
      .execute()

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          updateComment(id: ${res.raw[0].id}, text: "Fixed body") {
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
              comments(questionId: ${questionId}) {
                id,
                text
              }
            }`,
          })
      })
      .then((res) => {
        expect(res.body.data.comments.length).toEqual(1)
        expect(res.body.data.comments[0].text).toEqual('Fixed body')
      })
  })

  it('cannot edit a comment a user did not create', async () => {
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

    const questionId = await createQuestion()

    const res = await connection
      .createQueryBuilder()
      .insert()
      .into(Comment)
      .values({
        text: 'Comment body',
        userId: userRes.raw[0].id,
        questionId,
      })
      .returning(['id'])
      .execute()

    return request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `mutation {
          updateComment(id: ${res.raw[0].id}, text: "Fixed body") {
            text
          }
        }`,
      })
      .then((res) => {
        expect(res.status).toEqual(200)
        expect(res.body.errors[0].message).toEqual('Cannot access this comment')
      })
  })
})
