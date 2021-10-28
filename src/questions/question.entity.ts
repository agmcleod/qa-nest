import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

import { User } from '../users/user.entity'
import { Comment } from '../comments/comment.entity'

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: '' })
  title: string

  @Column({ type: 'text' })
  text: string

  @Column('int')
  userId: number

  @ManyToOne(() => User, (user) => user.questions)
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
  updatedAt: Date
}
