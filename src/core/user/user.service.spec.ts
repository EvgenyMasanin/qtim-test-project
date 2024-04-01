import { BadRequestException } from '@nestjs/common'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { Role } from 'src/auth/constants'
import { HashService } from 'src/hash/hash.service'

import { UserService } from './user.service'
import { RoleService } from '../role/role.service'
import { UserEntity } from './entities/user.entity'
import { CreateUserDto } from './dto/create-user.dto'

describe('UserService', () => {
  let service: UserService

  const userRepositoryMock = {
    save: jest.fn().mockImplementation((userDto) => ({ id: expect.any(Number), ...userDto })),
    create: jest.fn().mockImplementation((userDto) => userDto),
    findOneBy: jest.fn(),
    update: jest.fn(),
  }

  const roleServiceMock = {
    getRolesByNames: jest
      .fn()
      .mockImplementation((names: string[]) =>
        names.map((name) => ({ id: expect.any(Number), name }))
      ),
  }

  const hashServiceMock = {
    hashData: jest.fn(),
    compareData: jest.fn(),
  }

  const createUserDtoMock: CreateUserDto = {
    email: 'test@gmail.com',
    password: '12345678',
    roles: [Role.USER],
  }

  const newUser = {
    id: expect.any(Number),
    email: createUserDtoMock.email,
    password: createUserDtoMock.password,
    roles: expect.arrayContaining([{ id: expect.any(Number), name: Role.USER }]),
  }

  const idMock = 1

  const tokenMock = 'token'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        HashService,
        RoleService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryMock,
        },
      ],
    })
      .overrideProvider(RoleService)
      .useValue(roleServiceMock)
      .overrideProvider(HashService)
      .useValue(hashServiceMock)
      .compile()

    service = module.get<UserService>(UserService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should throw BadRequestException if user with provided email already exist', async () => {
      jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce({} as UserEntity)

      await expect(service.create(createUserDtoMock)).rejects.toThrow(BadRequestException)
    })

    it('should create and return new user', async () => {
      jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(null)
      jest.spyOn(hashServiceMock, 'hashData').mockImplementationOnce((data) => data)

      expect(await service.create(createUserDtoMock)).toEqual(newUser)
    })
  })

  describe('findOneById', () => {
    it('should throw BadRequestException if there is no user with provided id', async () => {
      const findOneByMethod = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValueOnce(null)

      await expect(service.findOneById(idMock)).rejects.toThrow(BadRequestException)
      expect(findOneByMethod).toHaveBeenCalledWith({ id: idMock })
    })

    it('should not throw BadRequestException if there is no user with provided id and shouldThrowException equals to true', async () => {
      const findOneByMethod = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValueOnce(null)

      await expect(service.findOneById(idMock, true)).rejects.toThrow(BadRequestException)
      expect(findOneByMethod).toHaveBeenCalledWith({ id: idMock })
    })

    it('should find and return user with provided id', async () => {
      const findOneByMethod = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValueOnce({ id: idMock })

      expect(await service.findOneById(idMock)).toEqual({ id: idMock })
      expect(findOneByMethod).toHaveBeenCalledWith({ id: idMock })
    })

    it('should return null if user not found and shouldThrowException equals to false', async () => {
      const findOneByMethod = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValueOnce(null)

      expect(await service.findOneById(idMock, false)).toBeNull()
      expect(findOneByMethod).toHaveBeenCalledWith({ id: idMock })
    })
  })

  describe('findOneByEmail', () => {
    it('should return null if user with provided email not found', async () => {
      const findOneByMethod = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockResolvedValueOnce(null)

      expect(await service.findOneByEmail(createUserDtoMock.email)).toBeNull()

      expect(findOneByMethod).toHaveBeenCalledWith({ email: createUserDtoMock.email })
    })

    it('should find and return user by email', async () => {
      const findOneByMethod = jest
        .spyOn(userRepositoryMock, 'findOneBy')
        .mockImplementationOnce(({ email }) => Promise.resolve({ id: expect.any(Number), email }))

      expect(await service.findOneByEmail(createUserDtoMock.email)).toEqual({
        id: expect.any(Number),
        email: createUserDtoMock.email,
      })

      expect(findOneByMethod).toHaveBeenCalledWith({ email: createUserDtoMock.email })
    })
  })

  describe('updateRefreshToken', () => {
    it('should throw BadRequestException if there is no user with provided id', async () => {
      jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValueOnce(null)

      await expect(service.updateRefreshToken(idMock, '')).rejects.toThrow(BadRequestException)
    })

    it('should update refresh token if user with provided id is exist', async () => {
      jest.spyOn(userRepositoryMock, 'findOneBy').mockResolvedValueOnce(true)
      const updateMethod = jest
        .spyOn(userRepositoryMock, 'update')
        .mockResolvedValueOnce({ affected: idMock })

      expect(await service.updateRefreshToken(idMock, tokenMock)).toBe(true)

      expect(updateMethod).toHaveBeenCalledWith(idMock, { refreshToken: tokenMock })
    })
  })
})
