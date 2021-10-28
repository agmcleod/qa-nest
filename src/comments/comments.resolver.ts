import { UseGuards } from '@nestjs/common'
import {
  Resolver,
  Query,
  ResolveField,
  Mutation,
  Int,
  Parent,
  Args,
} from '@nestjs/graphql'
import { ForbiddenError, UserInputError } from 'apollo-server-express'

import { Comment } from './comment.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CommentsService } from './comments.service'
import { AuthUser } from '../auth/auth-user.dto'
import { CurrentUser } from '../auth/current-user.decorator'
import { UsersLoader } from '../users/users.loader'

@UseGuards(JwtAuthGuard)
@Resolver(() => Comment)
export class CommentsResolver {
  constructor(
    private commentsService: CommentsService,
    private usersLoader: UsersLoader,
  ) {}

  @Query(() => Comment)
  async comment(@Args('id', { type: () => Int }) id: number) {
    return this.commentsService.findById(id)
  }

  @Query(() => [Comment])
  async comments(@Args('questionId', { type: () => Int }) questionId: number) {
    return this.commentsService.findByQuestion(questionId)
  }

  @ResolveField()
  async user(@Parent() comment: Comment) {
    return this.usersLoader.load(comment.userId)
  }

  @Mutation(() => Comment)
  async createComment(
    @Args({ name: 'text' }) text: string,
    @Args({ name: 'questionId', type: () => Int }) questionId: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.commentsService.create(questionId, text, user.userId)
  }

  @Mutation(() => Comment)
  async updateComment(
    @Args({ name: 'id', type: () => Int }) id: number,
    @Args({ name: 'text' }) text: string,
    @CurrentUser() user: AuthUser,
  ) {
    const comment = await this.commentsService.findById(id)
    if (!comment) {
      throw new UserInputError('Comment not found')
    }
    if (comment.userId !== user.userId) {
      throw new ForbiddenError('Cannot access this comment')
    }

    return this.commentsService.update(id, text)
  }
}
