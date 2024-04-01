import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CacheModule } from 'src/cache/cache.module'

import { ArticleService } from './article.service'
import { ArticleController } from './article.controller'
import { ArticleEntity } from './entities/article.entity'

@Module({
  controllers: [ArticleController],
  imports: [TypeOrmModule.forFeature([ArticleEntity]), CacheModule],
  providers: [ArticleService],
})
export class ArticleModule {}
