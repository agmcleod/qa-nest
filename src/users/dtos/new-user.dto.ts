import { IsNotEmpty } from 'class-validator'

import { ValidateUniqueUsername } from '../validators/validate-unique-username'

export class NewUser {
  @IsNotEmpty()
  @ValidateUniqueUsername({
    message: 'User $value already exists. Choose another name.',
  })
  username: string
  @IsNotEmpty()
  password: string
}
