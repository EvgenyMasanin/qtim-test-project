import { ApiProperty, PickType } from '@nestjs/swagger'

import { UserEntity } from 'src/core/user/entities/user.entity'

import { Tokens } from './tokens.dto'

export class AuthUserDto extends PickType(UserEntity, ['id', 'email', 'roles'] as const) {
  @ApiProperty()
  tokens: Tokens
}
