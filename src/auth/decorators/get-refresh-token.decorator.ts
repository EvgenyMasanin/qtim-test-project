import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const GetRefreshToken = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest()

    return request.user.refreshToken
  }
)
