import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

@Injectable()
export class BcryptService {
  async hashString(value: string) {
    return await bcrypt.hash(value, SALT_ROUNDS)
  }

  async compare(hash: string, value: string) {
    return await bcrypt.compare(value, hash)
  }
}
