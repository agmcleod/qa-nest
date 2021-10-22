import { Injectable } from '@nestjs/common'
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

import { UsersService } from '../users.service'

@Injectable()
@ValidatorConstraint({ async: true })
export class ValidateUniqueUsernameConstraint
  implements ValidatorConstraintInterface
{
  constructor(private usersService: UsersService) {}

  async validate(userName: string) {
    const user = await this.usersService.findByUsername(userName)

    return !user
  }
}

export function ValidateUniqueUsername(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateUniqueUsernameConstraint,
    })
  }
}
