import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { ExecutionContext, Injectable } from '@nestjs/common'

import { IS_PUBLIC } from '../decorators'
import { JwtStrategies } from '../strategies'

@Injectable()
export class AccessTokenGuard extends AuthGuard(JwtStrategies.JWT) {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC, [
      context.getHandler(),

      context.getClass(),
    ])

    if (isPublic) return true

    return super.canActivate(context)
  }
}
