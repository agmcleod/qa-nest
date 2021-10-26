import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Question } from '../questions/question.entity'
import { User } from '../users/user.entity'
import { Comment } from './comment.entity'

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  findById(id: number): Promise<Comment> {
    return this.commentRepository.findOne({
      where: {
        id,
      },
    })
  }

  findByQuestion(questionId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        questionId,
      },
    })
  }

  create(questionId: number, text: string, userId: number): Promise<Comment> {
    const comment = this.commentRepository.create()
    comment.text = text

    const question = new Question()
    question.id = questionId
    comment.question = question
    const user = new User()
    user.id = userId
    comment.user = user

    return this.commentRepository.save(comment)
  }

  async update(id: number, text: string): Promise<Comment> {
    const comment = await this.findById(id)
    comment.text = text

    return this.commentRepository.save(comment)
  }
}
