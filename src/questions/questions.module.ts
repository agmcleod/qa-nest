import { Module } from '@nestjs/common'
import { QuestionsService } from './questions.service'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Question } from './question.entity'
import { BcryptService } from '../common/services/bcrypt.service'
import { QuestionsResolver } from './questions.resolver'
import { UsersService } from '../users/users.service'
import { User } from '../users/user.entity'
import { UsersLoader } from '../users/users.loader'
import { Comment } from '../comments/comment.entity'
import { CommentsLoader } from '../comments/comments.loader'
import { CommentsService } from '../comments/comments.service'

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Question, User])],
  providers: [
    QuestionsService,
    UsersService,
    QuestionsResolver,
    BcryptService,
    UsersLoader,
    CommentsService,
    CommentsLoader,
  ],
})
export class QuestionsModule {}
