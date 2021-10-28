import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
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

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'now()',
  })
  createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: true,
    onUpdate: 'now()',
  })
  @Field()
  updatedAt: Date
}
