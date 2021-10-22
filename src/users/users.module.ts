import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './user.entity'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UsersResolver } from './users.resolver'
import { BcryptService } from '../common/services/bcrypt.service'
import { Question } from '../questions/question.entity'
import { QuestionsService } from '../questions/questions.service'
import { ValidateUniqueUsernameConstraint } from './validators/validate-unique-username'

@Module({
  imports: [TypeOrmModule.forFeature([User, Question])],
  providers: [
    UsersService,
    BcryptService,
    ValidateUniqueUsernameConstraint,
    UsersResolver,
    QuestionsService,
  ],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
