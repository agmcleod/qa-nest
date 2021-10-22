import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { User } from '../users/user.entity'
import { BcryptService } from '../common/services/bcrypt.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private bcryptService: BcryptService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username)
    if (!user) {
      return null
    }
    const valid = await this.bcryptService.compare(user.password, password)
    if (!valid) {
      return null
    }

    return user
  }

  async login(user: User) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    }
  }
}
