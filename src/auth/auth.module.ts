import { JwtModule } from '@nestjs/jwt'
import { Module } from '@nestjs/common'

import { EnvModule } from 'src/env/env.module'
import { HashModule } from 'src/hash/hash.module'
import { UserModule } from 'src/core/user/user.module'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AtJwtStrategy, RtJwtStrategy } from './strategies'

@Module({
  providers: [AuthService, RtJwtStrategy, AtJwtStrategy],
  imports: [JwtModule.register({}), HashModule, EnvModule, UserModule],
  controllers: [AuthController],
})
export class AuthModule {}
