import {
  Resolver,
  Query,
  Args,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { User } from './user.entity'
import { QuestionType } from '../questions/question.objectType'
import { UsersService } from './users.service'
import { QuestionsService } from '../questions/questions.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private questionsService: QuestionsService,
  ) {}

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number) {
    return this.usersService.findById(id)
  }

  @Query(() => [User])
  async users() {
    return this.usersService.findAll()
  }

  @ResolveField()
  async questions(@Parent() user: User) {
    const results = await this.questionsService.findByUser(user.id)

    return results.map(QuestionType.fromQuestionEntity)
  }
}
