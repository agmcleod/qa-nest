import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Question } from '../questions/question.entity'

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number

  @Column({ unique: true })
  @Field()
  username: string

  @Column()
  password: string

  @OneToMany(() => Question, (question) => question.user)
  @Field((type) => [Question])
  questions: Question[]
}
