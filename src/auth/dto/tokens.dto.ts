import { ApiProperty } from '@nestjs/swagger'

export class Tokens {
  @ApiProperty()
  accessToken: string

  @ApiProperty()
  refreshToken: string
}

export class TokenPayload {
  sub: number
  email: string
  roles: string[]
}
