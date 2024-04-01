import { getRepositoryToken } from '@nestjs/typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { Role } from 'src/auth/constants'

import { RoleService } from './role.service'
import { RoleEntity } from './entities/role.entity'

describe('RoleService', () => {
  let service: RoleService

  const roleRepositoryMock = {
    findOneBy: jest.fn().mockImplementation(({ name }: { name: string }) => {
      if (!Object.values(Role).includes(name as Role)) return null

      return Promise.resolve({ id: expect.any(Number), name })
    }),

    findBy: jest.fn().mockImplementation(({ name: { _value } }: { name: { _value: string[] } }) => {
      const names = _value

      const allowedNames = Object.values(Role)

      return Promise.resolve(
        names
          .filter((name) => allowedNames.includes(name as Role))
          .map((name) => ({ id: expect.any(Number), name }))
      )
    }),
  }

  const roleNameMock = 'any_role'

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: roleRepositoryMock,
        },
      ],
    }).compile()

    service = module.get<RoleService>(RoleService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('getRoleByName', () => {
    it('should return role by role name', async () => {
      expect(await service.getRoleByName(Role.USER)).toEqual({
        id: expect.any(Number),
        name: Role.USER,
      })
    })

    it('should return null if role with provided name does not exist', async () => {
      expect(await service.getRoleByName(roleNameMock as Role)).toBeNull()
    })
  })

  describe('getRolesByNames', () => {
    it('should return roles by roles names', async () => {
      expect(await service.getRolesByNames([Role.USER])).toEqual([
        {
          id: expect.any(Number),
          name: Role.USER,
        },
      ])
    })

    it('should return null if role with provided name does not exist', async () => {
      expect(await service.getRolesByNames([Role.ADMIN, roleNameMock] as Role[])).toEqual([
        {
          id: expect.any(Number),
          name: Role.ADMIN,
        },
      ])
    })
  })
})
