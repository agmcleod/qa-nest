import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Field, Int, ObjectType } from '@nestjs/graphql'

import { User } from '../users/user.entity'

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
}
