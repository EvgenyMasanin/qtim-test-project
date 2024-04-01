import { ApiProperty } from '@nestjs/swagger'

import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
  @ApiProperty({ example: 'test@gmail.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'bu1n3o4kn1jn4' })
  @IsString()
  @MinLength(8)
  password: string
}
