import { AuthGuard } from '@nestjs/passport'

import { JwtStrategies } from '../strategies'

export class RefreshTokenGuard extends AuthGuard(JwtStrategies.JWT_REFRESH) {
  constructor() {
    super()
  }
}
