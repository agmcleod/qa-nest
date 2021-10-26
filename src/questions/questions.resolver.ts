import {
  Resolver,
  Query,
  Args,
  Int,
  Parent,
  ResolveField,
  Mutation,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { UserInputError, ForbiddenError } from 'apollo-server-express'

import { Question } from './question.entity'
import { QuestionsService } from './questions.service'
import { UsersService } from '../users/users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { AuthUser } from '../auth/auth-user.dto'
import { Pagination } from '../common/pagination.entity'
import { UsersLoader } from '../users/users.loader'

@UseGuards(JwtAuthGuard)
@Resolver(() => Question)
export class QuestionsResolver {
  constructor(
    private usersService: UsersService,
    private questionsService: QuestionsService,
    private usersLoader: UsersLoader,
  ) {}

  @Query(() => Question)
  async question(@Args('id', { type: () => Int }) id: number) {
    return this.questionsService.findById(id)
  }

  @Query(() => [Question])
  async questions(
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
  ) {
    return this.questionsService.findAll(offset, limit)
  }

  @Query(() => Pagination)
  async questionsCount() {
    const count = await this.questionsService.count()
    return {
      count,
    }
  }

  @ResolveField()
  async user(@Parent() question: Question) {
    return this.usersLoader.load(question.userId)
  }

  @Mutation(() => Question)
  async createQuestion(
    @Args({ name: 'title' }) title: string,
    @Args({ name: 'text' }) text: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.questionsService.create(title, text, user.userId)
  }

  @Mutation(() => Question)
  async updateQuestion(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'title' }) title: string,
    @Args({ name: 'text' }) text: string,
    @CurrentUser() user: AuthUser,
  ) {
    const question = await this.questionsService.findById(id)
    if (!question) {
      throw new UserInputError('Question not found')
    }
    if (question.userId !== user.userId) {
      throw new ForbiddenError('Cannot access this question')
    }

    return this.questionsService.update(id, title, text)
  }
}
