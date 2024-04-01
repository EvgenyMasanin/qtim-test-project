import { getRepositoryToken } from '@nestjs/typeorm'
import { Test, TestingModule } from '@nestjs/testing'
import { ForbiddenException, NotFoundException } from '@nestjs/common'

import { TimePeriod } from 'src/common/enums'
import { getTimePeriodDates } from 'src/common/helpers'

import { ArticleCacheKey } from './enums'
import { FilterDto } from './dto/filter.dto'
import { ArticleService } from './article.service'
import { CacheService } from '../../cache/cache.service'
import { ArticleEntity } from './entities/article.entity'
import { CreateArticleDto } from './dto/create-article.dto'

describe('ArticleService', () => {
  let service: ArticleService

  const articleRepositoryMock = {
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
  }

  const cacheServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    clearListCache: jest.fn(),
  }

  const userMock = {
    id: 1,
    email: 'test@gmail.com',
    roles: [{ id: 1, name: 'user' }],
  }

  const articleMock = {
    id: 1,
    title: 'Sample Article',
    description: 'This is the description',
    publishedDate: new Date(),
    author: userMock,
  }

  const articleListMock = [
    articleMock,
    {
      id: 2,
      title: 'New article',
      description: articleMock.description,
      publishedDate: getTimePeriodDates(TimePeriod.Monthly)[0],
      author: { id: 2, email: 'new@gmail.com', roles: userMock.roles },
    },
  ]

  const titleMock = 'new title'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: articleRepositoryMock,
        },
        ArticleService,
      ],
    })
      .overrideProvider(CacheService)
      .useValue(cacheServiceMock)
      .compile()

    service = module.get<ArticleService>(ArticleService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should create a new article', async () => {
      const createArticleDto: CreateArticleDto = {
        title: 'Sample Article',
        description: 'This is the description',
      }

      const createArticleDtoWithAuthor = {
        ...createArticleDto,
        author: { id: userMock.id },
      }

      const newArticle = {
        id: expect.any(Number),
        author: userMock,
        ...createArticleDto,
        publishedDate: expect.any(Date),
      }

      jest
        .spyOn(articleRepositoryMock, 'save')
        .mockImplementation((article) => Promise.resolve({ id: Date.now(), ...article }))
      jest.spyOn(articleRepositoryMock, 'create').mockImplementation((dto) => dto)

      const findOneByMethod = jest
        .spyOn(articleRepositoryMock, 'findOneBy')
        .mockResolvedValueOnce(articleMock)
      const createMethod = jest.spyOn(articleRepositoryMock, 'create')
      const saveMethod = jest.spyOn(articleRepositoryMock, 'create')

      expect(await service.create(userMock.id, createArticleDto)).toEqual(newArticle)
      expect(createMethod).toHaveBeenCalledWith(createArticleDtoWithAuthor)
      expect(saveMethod).toHaveBeenCalledWith(createArticleDtoWithAuthor)
      expect(findOneByMethod).toHaveBeenCalledWith({ id: newArticle.id })
    })
  })

  describe('findAll', () => {
    it('should return list of articles with with pagination', async () => {
      const filterDto: FilterDto = {
        limit: 2,
      }

      jest
        .spyOn(articleRepositoryMock, 'findAndCount')
        .mockResolvedValueOnce([articleListMock, articleListMock.length])

      expect(await service.findAll(filterDto)).toEqual({
        data: articleListMock,
        pagination: {
          ...filterDto,
          offset: 0,
          total: articleListMock.length,
        },
      })
    })

    it('should return list of articles with with pagination by limit', async () => {
      const filterDto: FilterDto = {
        limit: 1,
      }

      const listMock = [articleListMock[0]]

      jest
        .spyOn(articleRepositoryMock, 'findAndCount')
        .mockResolvedValueOnce([listMock, articleListMock.length])

      expect(await service.findAll(filterDto)).toEqual({
        data: listMock,
        pagination: {
          ...filterDto,
          offset: 0,
          total: articleListMock.length,
        },
      })
    })

    it('should return list of articles with with pagination by title', async () => {
      const filterDto: FilterDto = {
        title: articleListMock[1].title,
      }

      const listMock = articleListMock.filter(({ title }) => title.includes(filterDto.title))

      jest
        .spyOn(articleRepositoryMock, 'findAndCount')
        .mockResolvedValueOnce([listMock, articleListMock.length])

      expect(await service.findAll(filterDto)).toEqual({
        data: listMock,
        pagination: {
          limit: 10,
          offset: 0,
          total: articleListMock.length,
        },
      })
    })

    it('should return list of articles with with pagination by time period', async () => {
      const filterDto: FilterDto = {
        timePeriod: TimePeriod.Daily,
      }

      const listMock = articleListMock.filter(
        ({ publishedDate }) => publishedDate > getTimePeriodDates(filterDto.timePeriod)[0]
      )

      jest
        .spyOn(articleRepositoryMock, 'findAndCount')
        .mockResolvedValueOnce([listMock, articleListMock.length])

      expect(await service.findAll(filterDto)).toEqual({
        data: listMock,
        pagination: {
          limit: 10,
          offset: 0,
          total: articleListMock.length,
        },
      })
    })

    it('should return list of articles with with pagination by author', async () => {
      const filterDto: FilterDto = {
        author: articleListMock[0].author.email,
      }

      const listMock = articleListMock.filter(({ author: { email } }) =>
        email.includes(filterDto.author)
      )

      jest
        .spyOn(articleRepositoryMock, 'findAndCount')
        .mockResolvedValueOnce([listMock, articleListMock.length])

      expect(await service.findAll(filterDto)).toEqual({
        data: listMock,
        pagination: {
          limit: 10,
          offset: 0,
          total: articleListMock.length,
        },
      })
    })
  })

  describe('findOneById', () => {
    it('should find article by id', async () => {
      const findOneByMethod = jest
        .spyOn(articleRepositoryMock, 'findOneBy')
        .mockResolvedValueOnce(articleMock)
      const getMethod = jest.spyOn(cacheServiceMock, 'get')

      expect(await service.findOneById(articleMock.id)).toEqual(articleMock)
      expect(findOneByMethod).toHaveBeenCalledWith({ id: articleMock.id })
      expect(getMethod).toHaveReturnedWith(undefined)
    })

    it('should throw NotFoundException if no such article', async () => {
      await expect(service.findOneById(1)).rejects.toThrow(NotFoundException)
    })

    it('should get article from cache', async () => {
      const keyCache = `${ArticleCacheKey.ARTICLE_CACHE}_${articleMock.id}`
      const getMethod = jest
        .spyOn(cacheServiceMock, 'get')
        .mockImplementationOnce((key: string) => key === keyCache && articleMock)

      expect(await service.findOneById(articleMock.id)).toEqual(articleMock)
      expect(getMethod).toHaveBeenCalledWith(keyCache)
    })

    it('should set article to cache', async () => {
      const keyCache = `${ArticleCacheKey.ARTICLE_CACHE}_${articleMock.id}`
      const setMethod = jest.spyOn(cacheServiceMock, 'set')
      jest.spyOn(cacheServiceMock, 'get')
      jest.spyOn(articleRepositoryMock, 'findOneBy').mockReturnValueOnce(articleMock)

      expect(await service.findOneById(articleMock.id)).toEqual(articleMock)
      expect(setMethod).toHaveBeenCalledWith(keyCache, articleMock)
    })
  })

  describe('update', () => {
    it('should throw ForbiddenException if user id does not match author id', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(articleMock as ArticleEntity)

      await expect(service.update(2, articleMock.id, { title: titleMock })).rejects.toThrow(
        ForbiddenException
      )
    })

    it('should update article', async () => {
      const key = `${ArticleCacheKey.ARTICLE_CACHE}_${articleMock.id}`
      const updatedArticle = { ...articleMock, title: titleMock }

      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(articleMock as ArticleEntity)

      jest.spyOn(articleRepositoryMock, 'findOneBy').mockResolvedValueOnce(updatedArticle)

      const clearListCacheMethod = jest.spyOn(cacheServiceMock, 'clearListCache')
      const delMethod = jest.spyOn(cacheServiceMock, 'del')

      expect(await service.update(userMock.id, articleMock.id, { title: titleMock })).toEqual(
        updatedArticle
      )
      expect(clearListCacheMethod).toHaveBeenCalledWith(ArticleCacheKey.ARTICLE_LIST_CACHE)
      expect(delMethod).toHaveBeenCalledWith(key)
    })
  })

  describe('remove', () => {
    it('should throw ForbiddenException if user id does not match author id', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(articleMock as ArticleEntity)

      await expect(service.remove(2, articleMock.id)).rejects.toThrow(ForbiddenException)
    })

    it('should remove article', async () => {
      const key = `${ArticleCacheKey.ARTICLE_CACHE}_${articleMock.id}`

      jest.spyOn(service, 'findOneById').mockResolvedValueOnce(articleMock as ArticleEntity)

      const deleteMethod = jest.spyOn(articleRepositoryMock, 'delete').mockResolvedValueOnce({
        affected: 1,
      })

      const clearListCacheMethod = jest.spyOn(cacheServiceMock, 'clearListCache')
      const delMethod = jest.spyOn(cacheServiceMock, 'del')

      expect(await service.remove(userMock.id, articleMock.id)).toBe(true)
      expect(deleteMethod).toHaveBeenCalledWith(articleMock.id)
      expect(clearListCacheMethod).toHaveBeenCalledWith(ArticleCacheKey.ARTICLE_LIST_CACHE)
      expect(delMethod).toHaveBeenCalledWith(key)
    })

    it('should throw NotFoundException if no such article', async () => {
      jest.spyOn(articleRepositoryMock, 'delete').mockResolvedValueOnce({
        affected: 0,
      })

      await expect(service.remove(userMock.id, articleMock.id)).rejects.toThrow(NotFoundException)
    })
  })
})
