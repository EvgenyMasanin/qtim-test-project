import { Between, ILike, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { getTimePeriodDates } from 'src/common/helpers'
import { CacheService } from 'src/cache/cache.service'
import { PaginationDto } from 'src/common/dto/pagination.dto'

import { ArticleCacheKey } from './enums'
import { FilterDto } from './dto/filter.dto'
import { ArticleEntity } from './entities/article.entity'
import { CreateArticleDto } from './dto/create-article.dto'
import { UpdateArticleDto } from './dto/update-article.dto'

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>,
    private readonly cacheService: CacheService
  ) {}

  async create(authorId: number, createArticleDto: CreateArticleDto) {
    const newArticle = this.articleRepository.create({
      ...createArticleDto,
      author: { id: authorId },
    })

    const { id } = await this.articleRepository.save(newArticle)

    this.clearListCache()

    return this.findOneById(id)
  }

  async findAll(filterDto: FilterDto) {
    const { limit = 10, offset = 0, author, timePeriod, title } = filterDto

    const [data, total] = await this.articleRepository.findAndCount({
      where: {
        author: author && { email: ILike(`%${author}%`) },
        title: title && ILike(`%${title}%`),
        publishedDate: timePeriod && Between(...getTimePeriodDates(timePeriod)),
      },
      take: limit,
      skip: offset,
    })

    const pagination: PaginationDto = {
      limit,
      offset,
      total,
    }

    return { data, pagination }
  }

  async findOneById(id: number) {
    const cacheKey = this.getArticleCacheKey(id)
    const cachedArticle = await this.cacheService.get<ArticleEntity>(cacheKey)

    if (cachedArticle) {
      return cachedArticle
    }

    const article = await this.articleRepository.findOneBy({ id })

    if (!article) this.throwNotFoundArticleException()

    this.cacheService.set(cacheKey, article)

    return article
  }

  async update(userId: number, articleId: number, updateArticleDto: UpdateArticleDto) {
    await this.checkRights(userId, articleId)

    await this.articleRepository.update(articleId, updateArticleDto)
    this.clearListCache()
    this.cacheService.del(this.getArticleCacheKey(articleId))

    return this.findOneById(articleId)
  }

  async remove(userId: number, articleId: number) {
    await this.checkRights(userId, articleId)

    const { affected } = await this.articleRepository.delete(articleId)

    const isDeleted = affected === 1

    if (!isDeleted) this.throwNotFoundArticleException()

    this.cacheService.del(this.getArticleCacheKey(articleId))
    this.clearListCache()

    return isDeleted
  }

  private getArticleCacheKey(id: number) {
    return `${ArticleCacheKey.ARTICLE_CACHE}_${id}`
  }

  private async clearListCache() {
    await this.cacheService.clearListCache(ArticleCacheKey.ARTICLE_LIST_CACHE)
  }

  private async checkRights(userId: number, articleId: number) {
    const article = await this.findOneById(articleId)

    if (article.author.id !== userId) throw new ForbiddenException('Access denied!')
  }

  private throwNotFoundArticleException() {
    throw new NotFoundException('There is no such article!')
  }
}
