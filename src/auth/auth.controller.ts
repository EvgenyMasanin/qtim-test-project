import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common'

import { Message } from 'src/common/decorators'
import { ApiDocumentation } from 'src/api-documentation/decorators'

import {
  AuthMessage,
  LOGOUT_DOCUMENTATION,
  ME_DOCUMENTATION,
  REFRESH_DOCUMENTATION,
  SIGNIN_DOCUMENTATION,
  SIGNUP_DOCUMENTATION,
} from './api-documentation'
import { RefreshTokenGuard } from './guards'
import { AuthDto } from './dto/auth.dto'
import { AuthService } from './auth.service'
import { GetCurrentUserId, GetRefreshToken, Public } from './decorators'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Message(AuthMessage.SIGNUP)
  @ApiDocumentation(SIGNUP_DOCUMENTATION)
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto)
  }

  @Post('signin')
  @Public()
  @ApiDocumentation(SIGNIN_DOCUMENTATION)
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto)
  }

  @Patch('logout')
  @Message(AuthMessage.LOGOUT)
  @ApiDocumentation(LOGOUT_DOCUMENTATION)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId)
  }

  @Patch('refresh')
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Message(AuthMessage.REFRESH)
  @ApiDocumentation(REFRESH_DOCUMENTATION)
  refresh(@GetCurrentUserId() userId: number, @GetRefreshToken() refreshToken: string) {
    return this.authService.refreshTokens(userId, refreshToken)
  }

  @Get('me')
  @ApiDocumentation(ME_DOCUMENTATION)
  getMe(@GetCurrentUserId() userId: number) {
    return this.authService.getMe(userId)
  }
}
