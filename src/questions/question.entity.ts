import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, Int, ObjectType } from '@nestjs/graphql'

import { User } from '../users/user.entity'
import { Comment } from '../comments/comment.entity'

@Entity()
@ObjectType()
export class Question {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column({ default: '' })
  @Field()
  title: string

  @Column({ type: 'text' })
  @Field()
  text: string

  @Column('int')
  userId: number

  @ManyToOne(() => User, (user) => user.questions)
  @Field(() => User)
  user: User

  @OneToMany(() => Comment, (comment) => comment.question)
  comments: Comment[]

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
