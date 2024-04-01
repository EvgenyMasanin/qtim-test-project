import { In, Repository } from 'typeorm'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Role } from '../../auth/constants'
import { RoleEntity } from './entities/role.entity'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>
  ) {}

  async getRoleByName(name: Role) {
    return await this.roleRepository.findOneBy({ name })
  }

  async getRolesByNames(names: Role[]) {
    return await this.roleRepository.findBy({ name: In(names) })
  }
}
