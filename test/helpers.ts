import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'typeorm'
import * as request from 'supertest'

import { AppModule } from '../src/app.module'
import { Comment } from '../src/comments/comment.entity'
import { User } from '../src/users/user.entity'
import { Question } from '../src/questions/question.entity'
import { BcryptService } from '../src/common/services/bcrypt.service'

export async function cleanDb(connection: Connection) {
  await connection.createQueryBuilder().delete().from(Comment).execute()
  await connection.createQueryBuilder().delete().from(Question).execute()
  await connection.createQueryBuilder().delete().from(User).execute()
}

export async function createTestingModule(): Promise<{
  app: INestApplication
  connection: Connection
}> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  const app = moduleFixture.createNestApplication()
  await app.init()

  const connection = app.get(Connection)

  return {
    app,
    connection,
  }
}

export async function loginBeforeRequest(
  app: INestApplication,
  connection: Connection,
): Promise<{ token: string; userId: number }> {
  const bcryptService = new BcryptService()
  const res = await connection
    .createQueryBuilder()
    .insert()
    .into(User)
    .values({
      username: 'userfore2e',
      password: await bcryptService.hashString('mypassword'),
    })
    .returning(['id'])
    .execute()

  const response = await request(app.getHttpServer()).post('/auth/login').send({
    username: 'userfore2e',
    password: 'mypassword',
  })

  return { token: response.body.access_token, userId: res.raw[0].id }
}
