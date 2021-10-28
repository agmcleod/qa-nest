import { Field, Int, ObjectType } from '@nestjs/graphql'

import { User } from '../users/user.entity'
import { Comment } from '../comments/comment.entity'
import { Question as QuestionEntity } from './question.entity'

@ObjectType()
export class QuestionType {
  @Field(() => Int)
  id: number

  @Field()
  title: string

  @Field()
  text: string

  @Field(() => User)
  user: User

  userId: number

  @Field(() => Comment)
  comments: Comment[]

  @Field()
  updatedAt: Date

  @Field(() => Int)
  commentCount: number

  static fromQuestionEntity(question: QuestionEntity) {
    const q = new QuestionType()

    q.id = question.id
    q.title = question.title
    q.text = question.text
    q.user = question.user
    q.userId = question.userId
    q.comments = question.comments
    q.updatedAt = question.updatedAt

    return q
  }
}
