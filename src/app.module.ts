import { Module } from '@nestjs/common'

import { DbModule } from './db/db.module'
import { EnvModule } from './env/env.module'
import { AuthModule } from './auth/auth.module'
import { HashModule } from './hash/hash.module'
import { UserModule } from './core/user/user.module'
import { RoleModule } from './core/role/role.module'
import { ArticleModule } from './core/article/article.module'
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [AuthModule, UserModule, ArticleModule, RoleModule, DbModule, EnvModule, HashModule, CacheModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
