import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'

import { EnvService } from 'src/env/env.service'
import { HashService } from 'src/hash/hash.service'
import { UserService } from 'src/core/user/user.service'

import { AuthDto } from './dto/auth.dto'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let service: AuthService

  const jwtServiceMock = {
    signAsync: jest.fn().mockResolvedValue(expect.any(String)),
  }
  const hashServiceMock = {
    hashData: jest.fn(),
    compareData: jest.fn(),
  }

  const secretMock = 'secret'

  const envServiceMock = {
    get: jest.fn().mockReturnValue(secretMock),
  }

  const userServiceMock = {
    findOneById: jest.fn(),
    findOneByEmail: jest.fn(),
    create: jest.fn(),
    updateRefreshToken: jest.fn(),
  }

  const authDtoMock: AuthDto = {
    email: 'test@gmail.com',
    password: '12345678',
  }

  const createdUserDtoMock = {
    id: expect.any(Number),
    email: authDtoMock.email,
    roles: [{ id: expect.any(Number), name: 'user' }],
  }

  const tokensMock = {
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
  }

  const authUserDtoMock = {
    ...createdUserDtoMock,
    tokens: tokensMock,
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, HashService, EnvService, UserService],
    })
      .overrideProvider(JwtService)
      .useValue(jwtServiceMock)
      .overrideProvider(HashService)
      .useValue(hashServiceMock)
      .overrideProvider(EnvService)
      .useValue(envServiceMock)
      .overrideProvider(UserService)
      .useValue(userServiceMock)
      .compile()

    service = module.get<AuthService>(AuthService)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('signup', () => {
    it('should create new user', async () => {
      jest.spyOn(userServiceMock, 'create').mockResolvedValueOnce(createdUserDtoMock)

      expect(await service.signup(authDtoMock)).toEqual(authUserDtoMock)
    })

    it('should throw UnauthorizedException if user with email already exists', async () => {
      jest.spyOn(userServiceMock, 'findOneByEmail').mockResolvedValueOnce(true)

      await expect(service.signup(authDtoMock)).rejects.toThrow(UnauthorizedException)
    })

    it('should call generateTokens that calls jwtService.signAsync twice to generate tokens', async () => {
      jest.spyOn(userServiceMock, 'create').mockResolvedValueOnce(createdUserDtoMock)

      const signAsyncMethod = jest.spyOn(jwtServiceMock, 'signAsync')

      const accessSecret = `access-${secretMock}`
      const refreshSecret = `refresh-${secretMock}`
      await service.signup(authDtoMock)

      expect(signAsyncMethod).toHaveBeenCalledWith(expect.any(Object), {
        secret: accessSecret,
        expiresIn: '30m',
      })
      expect(signAsyncMethod).toHaveBeenCalledWith(expect.any(Object), {
        secret: refreshSecret,
        expiresIn: '30d',
      })
    })
  })

  describe('signin', () => {
    it('should throw UnauthorizedException if user with email does not exist', async () => {
      jest.spyOn(userServiceMock, 'findOneByEmail').mockResolvedValueOnce(false)

      await expect(service.signin(authDtoMock)).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if password does not match', async () => {
      jest.spyOn(userServiceMock, 'findOneByEmail').mockResolvedValueOnce(true)
      jest.spyOn(hashServiceMock, 'compareData').mockResolvedValueOnce(false)

      await expect(service.signin(authDtoMock)).rejects.toThrow(UnauthorizedException)
    })

    it('should return auth user object with tokens if credentials are valid', async () => {
      jest.spyOn(userServiceMock, 'findOneByEmail').mockResolvedValueOnce(createdUserDtoMock)
      jest.spyOn(hashServiceMock, 'compareData').mockResolvedValueOnce(true)

      expect(await service.signin(authDtoMock)).toEqual(authUserDtoMock)
    })
  })

  it('should logout user', async () => {
    const updateRefreshTokenMethod = jest
      .spyOn(userServiceMock, 'updateRefreshToken')
      .mockResolvedValue(true)

    expect(await service.logout(1)).toBe(true)
    expect(updateRefreshTokenMethod).toHaveBeenCalledWith(1, null)
  })

  describe('getMe', () => {
    it('should throw UnauthorizedException if user with id does not exist', async () => {
      jest.spyOn(userServiceMock, 'findOneById').mockResolvedValueOnce(false)

      await expect(service.getMe(1)).rejects.toThrow(UnauthorizedException)
    })

    it('should return auth user object with tokens if credentials are valid', async () => {
      jest.spyOn(userServiceMock, 'findOneById').mockResolvedValueOnce(createdUserDtoMock)

      expect(await service.getMe(1)).toEqual(authUserDtoMock)
    })
  })

  describe('refreshTokens', () => {
    it('should throw UnauthorizedException if user with id does not exist', async () => {
      jest.spyOn(userServiceMock, 'findOneById').mockResolvedValueOnce(false)

      await expect(service.refreshTokens(1, 'rt')).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if user does not have refresh token', async () => {
      jest.spyOn(userServiceMock, 'findOneById').mockResolvedValueOnce(createdUserDtoMock)

      await expect(service.refreshTokens(1, 'rt')).rejects.toThrow(UnauthorizedException)
    })

    it('should throw UnauthorizedException if refresh tokens does not match', async () => {
      jest
        .spyOn(userServiceMock, 'findOneById')
        .mockResolvedValueOnce({ ...createdUserDtoMock, refreshToken: 'refresh' })

      const compareDataMethod = jest
        .spyOn(hashServiceMock, 'compareData')
        .mockResolvedValueOnce(false)

      await expect(service.refreshTokens(1, 'rt')).rejects.toThrow(UnauthorizedException)
      expect(compareDataMethod).toHaveBeenCalledWith('rt', 'refresh')
    })

    it('should return updated tokens', async () => {
      jest
        .spyOn(userServiceMock, 'findOneById')
        .mockResolvedValueOnce({ ...createdUserDtoMock, refreshToken: 'refresh' })

      jest.spyOn(hashServiceMock, 'compareData').mockResolvedValueOnce(true)

      expect(await service.refreshTokens(1, 'rt')).toEqual(tokensMock)
    })
  })
})
