import { Response } from 'express'
import { Reflector } from '@nestjs/core'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

import { map, Observable } from 'rxjs'
import { DefaultMessage, RESPONSE_MESSAGE } from 'src/common/decorators'

interface StandardResponse<T> {
  statusCode: number
  response: T
}

@Injectable()
export class StandardResponseInterceptor<ToTransform, Transformed>
  implements NestInterceptor<ToTransform, StandardResponse<ToTransform | Transformed>>
{
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<ToTransform>
  ): Observable<StandardResponse<ToTransform | Transformed>> {
    const requiredRoles = this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE, [
      context.getHandler(),
      context.getClass(),
    ])

    const statusCode = context.switchToHttp().getResponse<Response>().statusCode

    const message = requiredRoles || DefaultMessage.SUCCESS

    return next.handle().pipe(map((response) => ({ statusCode, response, message })))
  }
}
