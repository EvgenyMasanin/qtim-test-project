import { JwtService } from '@nestjs/jwt'
import { Injectable, UnauthorizedException } from '@nestjs/common'

import { Role } from 'src/auth/constants'
import { EnvService } from 'src/env/env.service'
import { HashService } from 'src/hash/hash.service'
import { UserService } from 'src/core/user/user.service'
import { UserEntity } from 'src/core/user/entities/user.entity'
import { RoleEntity } from 'src/core/role/entities/role.entity'

import { AuthDto } from './dto/auth.dto'
import { Tokens } from './dto/tokens.dto'
import { AuthUserDto } from './dto/auth-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly hashService: HashService,
    private readonly envService: EnvService
  ) {}

  async signup({ email, password }: AuthDto): Promise<AuthUserDto> {
    const existingUser = await this.userService.findOneByEmail(email)

    if (existingUser) this.throwUnauthorizedException()

    const roles = [Role.USER]
    const user = await this.userService.create({ email, password, roles })

    const tokens = await this.generateTokens(user.id, user.email, roles)

    return this.getAuthUserDto(user, tokens)
  }

  async signin({ email, password }: AuthDto): Promise<AuthUserDto> {
    const user = await this.userService.findOneByEmail(email)

    if (!user) this.throwUnauthorizedException()

    const passwordMatch = await this.hashService.compareData(password, user.password)

    if (!passwordMatch) this.throwUnauthorizedException()

    const rolesNames = this.getRolesNames(user.roles)

    const tokens = await this.generateTokens(user.id, user.email, rolesNames)

    return this.getAuthUserDto(user, tokens)
  }

  logout(userId: number) {
    return this.userService.updateRefreshToken(userId, null)
  }

  async getMe(userId: number): Promise<AuthUserDto> {
    const user = await this.userService.findOneById(userId, false)

    if (!user) this.throwUnauthorizedException()

    const rolesNames = this.getRolesNames(user.roles)

    const tokens = await this.generateTokens(user.id, user.email, rolesNames)

    await this.updateRefreshToken(user.id, tokens.refreshToken)

    return this.getAuthUserDto(user, tokens)
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.userService.findOneById(userId, false)
    const { refreshToken } = user

    if (!user || !refreshToken) this.throwUnauthorizedException()

    const rtMatches = await this.hashService.compareData(rt, refreshToken)
    if (!rtMatches) this.throwUnauthorizedException()

    const rolesNames = this.getRolesNames(user.roles)

    const tokens = await this.generateTokens(user.id, user.email, rolesNames)

    return tokens
  }

  private async generateTokens(userId: number, email: string, roles: string[]): Promise<Tokens> {
    const tokensPayload = {
      sub: userId,
      email,
      roles,
    }

    const privateKey = this.envService.get('PRIVATE_KEY')

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(tokensPayload, {
        secret: `access-${privateKey}`,
        expiresIn: '30m',
      }),
      this.jwtService.signAsync(tokensPayload, {
        secret: `refresh-${privateKey}`,
        expiresIn: '30d',
      }),
    ])

    await this.updateRefreshToken(userId, refreshToken)

    return {
      accessToken,
      refreshToken,
    }
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await this.hashService.hashData(refreshToken)
    await this.userService.updateRefreshToken(userId, hash)
  }

  private getAuthUserDto({ id, email, roles }: UserEntity, tokens: Tokens): AuthUserDto {
    return {
      tokens,
      id,
      email,
      roles,
    }
  }

  private getRolesNames(roles: RoleEntity[]) {
    return roles.map((r) => r.name)
  }

  private throwUnauthorizedException() {
    throw new UnauthorizedException('Invalid credentials')
  }
}
