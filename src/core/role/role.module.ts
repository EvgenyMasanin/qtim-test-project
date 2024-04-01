import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { RoleService } from './role.service'
import { RoleEntity } from './entities/role.entity'

@Module({
  providers: [RoleService],
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  exports: [RoleService],
})
export class RoleModule {}
