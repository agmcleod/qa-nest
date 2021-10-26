import { Injectable } from '@nestjs/common'
import DataLoader = require('dataloader')

import { UsersService } from './users.service'
import { User } from './user.entity'

@Injectable()
export class UsersLoader {
  loader: DataLoader<number, User>

  constructor(usersService: UsersService) {
    this.loader = new DataLoader((keys) => usersService.findAllByIds(keys))
  }

  load(id: number) {
    return this.loader.load(id)
  }
}
