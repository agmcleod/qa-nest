import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { Connection } from 'typeorm'

import { AppModule } from '../src/app.module'
import { User } from '../src/users/user.entity'
import { Question } from '../src/questions/question.entity'

export async function cleanDb(connection: Connection) {
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
