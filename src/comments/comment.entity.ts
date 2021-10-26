import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Field, Int, ObjectType } from '@nestjs/graphql'

import { User } from '../users/user.entity'
import { Question } from '../questions/question.entity'

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column({ type: 'text' })
  @Field()
  text: string

  @Column('int')
  userId: number

  @ManyToOne(() => User, (user) => user.questions)
  @Field(() => User)
  user: User

  @Column('int')
  questionId: number

  @ManyToOne(() => Question, (question) => question.comments)
  question: Question
}
