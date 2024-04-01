import { Inject, Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'

import { Cache } from 'cache-manager'
import { instanceToPlain } from 'class-transformer'

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async clearListCache(customKey: string) {
    const keys: string[] = await this.cacheManager.store.keys()

    keys.forEach((key) => {
      if (key.startsWith(customKey)) {
        this.cacheManager.del(key)
      }
    })
  }

  async set(key: string, value: unknown, ttl?: number) {
    return this.cacheManager.set(key, instanceToPlain(value), ttl)
  }

  async get<T>(key: string) {
    return await this.cacheManager.get<T>(key)
  }

  async del(key: string) {
    return this.cacheManager.del(key)
  }

  async reset() {
    return this.cacheManager.reset()
  }
}
