import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { EnvService } from 'src/env/env.service'
import { TokenPayload } from 'src/auth/dto/tokens.dto'
import { UserService } from 'src/core/user/user.service'

import { JwtStrategies } from './jwt-strategies.enum'

@Injectable()
export class AtJwtStrategy extends PassportStrategy(Strategy, JwtStrategies.JWT) {
  constructor(
    private readonly envService: EnvService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `access-${envService.get('PRIVATE_KEY')}`,
    })
  }
  async validate(payload: TokenPayload) {
    const { sub: userId } = payload

    const { refreshToken } = await this.userService.findOneById(userId, false)

    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    return payload
  }
}
