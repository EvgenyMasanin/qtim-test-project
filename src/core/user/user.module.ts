import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { HashModule } from 'src/hash/hash.module'

import { UserService } from './user.service'
import { RoleModule } from '../role/role.module'
import { UserEntity } from './entities/user.entity'

@Module({
  controllers: [],
  imports: [TypeOrmModule.forFeature([UserEntity]), HashModule, RoleModule],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
