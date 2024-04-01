import { Request } from 'express'
import { CACHE_KEY_METADATA, CacheInterceptor } from '@nestjs/cache-manager'
import { applyDecorators, ExecutionContext, Injectable, UseInterceptors } from '@nestjs/common'

import { ResponseToPlainInterceptor } from 'src/common/interceptors'

@Injectable()
export class _CacheByQueryInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext) {
    const cacheKey = this.reflector.get<string>(CACHE_KEY_METADATA, context.getHandler())

    if (!cacheKey) {
      return super.trackBy(context)
    }

    const request = context.switchToHttp().getRequest<Request>()

    const key = Object.entries(request.query).reduce((key, [k, v]) => {
      return `${key}_${k}_${v}`
    }, cacheKey)

    return key
  }
}

export const CacheByQueryInterceptor = () =>
  applyDecorators(UseInterceptors(_CacheByQueryInterceptor, ResponseToPlainInterceptor))
