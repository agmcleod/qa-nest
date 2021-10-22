import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getManager } from 'typeorm'

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

  findAll(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async register(username: string, password: string): Promise<void> {
    const hash = await this.bcryptService.hashString(password)
    const user = getManager().create(User, {
      username,
      password: hash,
    })
    await this.usersRepository.save(user)
  }
}
