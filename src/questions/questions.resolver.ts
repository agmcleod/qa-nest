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

import { QuestionType } from './question.objectType'
import { QuestionsService } from './questions.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CurrentUser } from '../auth/current-user.decorator'
import { AuthUser } from '../auth/auth-user.dto'
import { Pagination } from '../common/pagination.entity'
import { UsersLoader } from '../users/users.loader'
import { CommentsLoader } from '../comments/comments.loader'

@UseGuards(JwtAuthGuard)
@Resolver(() => QuestionType)
export class QuestionsResolver {
  constructor(
    private questionsService: QuestionsService,
    private usersLoader: UsersLoader,
    private commentsLoader: CommentsLoader,
  ) {}

  @Query(() => QuestionType)
  async question(@Args('id', { type: () => Int }) id: number) {
    const question = await this.questionsService.findById(id)
    return QuestionType.fromQuestionEntity(question)
  }

  @Query(() => [QuestionType])
  async questions(
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
  ) {
    const results = await this.questionsService.findAll(offset, limit)
    return results.map(QuestionType.fromQuestionEntity)
  }

  @Query(() => Pagination)
  async questionsCount() {
    const count = await this.questionsService.count()
    return {
      count,
    }
  }

  @ResolveField()
  async user(@Parent() question: QuestionType) {
    return this.usersLoader.load(question.userId)
  }

  @ResolveField(() => Int)
  async commentsCount(@Parent() question: QuestionType) {
    const res = await this.commentsLoader.load(question.id)
    return res.count
  }

  @Mutation(() => QuestionType)
  async createQuestion(
    @Args({ name: 'title' }) title: string,
    @Args({ name: 'text' }) text: string,
    @CurrentUser() user: AuthUser,
  ) {
    const q = await this.questionsService.create(title, text, user.userId)
    return QuestionType.fromQuestionEntity(q)
  }

  @Mutation(() => QuestionType)
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

    const q = await this.questionsService.update(id, title, text)
    return QuestionType.fromQuestionEntity(q)
  }
}
