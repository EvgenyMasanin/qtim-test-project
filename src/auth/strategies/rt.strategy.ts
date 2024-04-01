import { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'

import { EnvService } from 'src/env/env.service'
import { TokenPayload } from 'src/auth/dto/tokens.dto'

import { JwtStrategies } from './jwt-strategies.enum'

@Injectable()
export class RtJwtStrategy extends PassportStrategy(Strategy, JwtStrategies.JWT_REFRESH) {
  constructor(private readonly envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: `refresh-${envService.get('PRIVATE_KEY')}`,
      passReqToCallback: true,
    })
  }

  validate(req: Request, payload: TokenPayload) {
    const [, refreshToken] = req.headers.authorization.split(' ')
    return {
      ...payload,
      refreshToken,
    }
  }
}
