import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CommentsService } from './comments.service'
import { Comment } from './comment.entity'
import { CommentsResolver } from './comments.resolver'
import { UsersService } from '../users/users.service'
import { BcryptService } from '../common/services/bcrypt.service'
import { User } from '../users/user.entity'
import { UsersLoader } from '../users/users.loader'

@Module({
  imports: [TypeOrmModule.forFeature([Comment, User])],
  providers: [
    CommentsService,
    CommentsResolver,
    UsersService,
    BcryptService,
    UsersLoader,
  ],
})
export class CommentsModule {}
