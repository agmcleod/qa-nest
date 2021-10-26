import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { User } from '../users/user.entity'
import { Question } from './question.entity'

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async findByUser(userId: number): Promise<Question[]> {
    return this.questionRepository.find({
      where: {
        user: userId,
      },
      order: {
        updatedAt: 'DESC',
      },
    })
  }

  count(): Promise<number> {
    return this.questionRepository.count()
  }

  findById(id: number): Promise<Question> {
    return this.questionRepository.findOne({
      where: {
        id,
      },
    })
  }

  findAll(offset?: number, limit?: number): Promise<Question[]> {
    return this.questionRepository.find({
      skip: offset,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    })
  }

  create(title: string, text: string, userId: number): Promise<Question> {
    const question = this.questionRepository.create()
    question.title = title
    question.text = text
    const user = new User()
    user.id = userId
    question.user = user

    return this.questionRepository.save(question)
  }

  async update(id: number, title: string, text: string): Promise<Question> {
    const question = await this.findById(id)
    question.title = title
    question.text = text

    return this.questionRepository.save(question)
  }
}
