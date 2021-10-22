import { Controller, Post, Body, BadRequestException } from '@nestjs/common'

import { UsersService } from './users.service'
import { NewUser } from './dtos/new-user.dto'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async register(@Body() newUser: NewUser) {
    const user = await this.usersService.findByUsername(newUser.username)
    if (user) {
      throw new BadRequestException({ alreadyExists: true })
    }
    return this.usersService.register(newUser.username, newUser.password)
  }
}
