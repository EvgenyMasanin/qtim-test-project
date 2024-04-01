import { ApiProperty } from '@nestjs/swagger'

import { Role } from 'src/auth/constants'
import { IsEmail, IsString } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  email: string
  @ApiProperty({ example: 'bu1n3o4kn1jn4' })
  @IsString()
  password: string
  @ApiProperty({ example: [Role.USER] })
  roles: Role[]
}
