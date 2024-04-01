import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CacheKey } from '@nestjs/cache-manager'

import { Message } from 'src/common/decorators'
import { GetCurrentUserId, Public } from 'src/auth/decorators'
import { ApiDocumentation } from 'src/api-documentation/decorators'
import { CacheByQueryInterceptor } from 'src/cache/interceptors/cache-by-query.interceptor'

import {
  ArticleMessage,
  CREATE_DOCUMENTATION,
  FIND_ALL_DOCUMENTATION,
  FIND_ONE_DOCUMENTATION,
  REMOVE_DOCUMENTATION,
  UPDATE_DOCUMENTATION,
} from './api-documentation'
import { ArticleCacheKey } from './enums'
import { FilterDto } from './dto/filter.dto'
import { ArticleService } from './article.service'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@ApiTags('Article')
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Message(ArticleMessage.CREATED)
  @ApiDocumentation(CREATE_DOCUMENTATION)
  create(@GetCurrentUserId() userId: number, @Body() createArticleDto: CreateArticleDto) {
    return this.articleService.create(userId, createArticleDto)
  }

  @Get()
  @Public()
  @CacheByQueryInterceptor()
  @CacheKey(ArticleCacheKey.ARTICLE_LIST_CACHE)
  @ApiDocumentation(FIND_ALL_DOCUMENTATION)
  async findAll(@Query() filterDto: FilterDto) {
    return this.articleService.findAll(filterDto)
  }

  @Get(':id')
  @Public()
  @ApiDocumentation(FIND_ONE_DOCUMENTATION)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articleService.findOneById(id)
  }

  @Patch(':id')
  @Message(ArticleMessage.UPDATED)
  @ApiDocumentation(UPDATE_DOCUMENTATION)
  update(
    @GetCurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticleDto: UpdateArticleDto
  ) {
    return this.articleService.update(userId, id, updateArticleDto)
  }

  @Delete(':id')
  @Message(ArticleMessage.DELETED)
  @ApiDocumentation(REMOVE_DOCUMENTATION)
  remove(@GetCurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.articleService.remove(userId, id)
  }
}
