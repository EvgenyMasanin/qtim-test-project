import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

import { map, Observable } from 'rxjs'
import { instanceToPlain } from 'class-transformer'

@Injectable()
export class ResponseToPlainInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(map((data) => instanceToPlain(data)))
  }
}
