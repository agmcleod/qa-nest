import { Module } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Question } from './question.entity'
import { BcryptService } from '../common/services/bcrypt.service'
import { QuestionsResolver } from './questions.resolver'
import { UsersService } from 'src/users/users.service'
import { User } from '../users/user.entity'
import { UsersLoader } from '../users/users.loader'

@Module({
  imports: [TypeOrmModule.forFeature([Question, User])],
  providers: [
    QuestionsService,
    UsersService,
    QuestionsResolver,
    BcryptService,
    UsersLoader,
  ],
})
export class QuestionsModule {}
