import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService, ConfigModule } from '@nestjs/config'

import { AuthService } from './auth.service'
import { UsersModule } from '../users/users.module'
import { BcryptService } from '../common/services/bcrypt.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SIGN_KEY'),
        signOptions: { expiresIn: '10h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, BcryptService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
