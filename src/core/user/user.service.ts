import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { BadRequestException, Injectable } from '@nestjs/common'

import { HashService } from 'src/hash/hash.service'

import { RoleService } from '../role/role.service'
import { UserEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    private readonly roleService: RoleService,
    private readonly hashService: HashService
  ) {}

  async create({ email, password, roles }: CreateUserDto) {
    const existingUser = await this.findOneByEmail(email)
    if (existingUser) throw new BadRequestException('Email already exists!')

    const userRoles = await this.roleService.getRolesByNames(roles)

    const hashPassword = await this.hashService.hashData(password)

    const newUser = this.userRepository.create({ email })

    newUser.password = hashPassword

    newUser.roles = userRoles

    return await this.userRepository.save(newUser)
  }

  async findOneById(id: number, shouldThrowException = true) {
    const user = await this.userRepository.findOneBy({ id })

    if (shouldThrowException && !user)
      throw new BadRequestException('There is no user with provided id!')

    return user
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email })
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    await this.findOneById(userId)

    const { affected } = await this.userRepository.update(userId, { refreshToken })

    const isUpdated = !!affected

    return isUpdated
  }
}
