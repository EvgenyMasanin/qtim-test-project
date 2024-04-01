import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { TokenPayload } from 'src/auth/dto/tokens.dto'

export const GetCurrentUser = createParamDecorator(
  (data: keyof TokenPayload | undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest()
    if (!data) return request.user

    return request.user[data]
  }
)
