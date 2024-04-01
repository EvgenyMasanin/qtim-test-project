import { DynamicModule, Module } from '@nestjs/common'
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager'

import { EnvModule } from 'src/env/env.module'
import { EnvService } from 'src/env/env.service'
import * as redisStore from 'cache-manager-redis-store'

import { CacheService } from './cache.service'

@Module({
  providers: [CacheService],
  imports: [
    NestCacheModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        store: redisStore,
        host: envService.get('REDIS_HOST'),
        port: envService.get('REDIS_PORT'),
        ttl: 60,
      }),
      isGlobal: true,
    }),
  ],
  exports: [CacheService],
})
export class CacheModule {
  static register(): DynamicModule {
    return {
      module: CacheModule,
      imports: [],
      exports: [NestCacheModule],
    }
  }
}
