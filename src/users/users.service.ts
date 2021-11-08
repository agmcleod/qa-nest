import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'

import { User } from './user.entity'
import { BcryptService } from '../common/services/bcrypt.service'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private bcryptService: BcryptService,
  ) {}

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        username,
      },
    })
  }

  findById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    })
  }

  findAllByIds(ids: readonly number[]): Promise<User[]> {
    return this.usersRepository.find({
      where: {
        id: In(ids as number[]),
      },
    })
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async register(username: string, password: string): Promise<void> {
    const hash = await this.bcryptService.hashString(password)
    const user = this.usersRepository.create({
      username,
      password: hash,
    })
    await this.usersRepository.save(user)
  }
}
