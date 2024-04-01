import { HttpStatus } from '@nestjs/common'

import { StandardResponse } from 'src/common/dto'
import { ApiTag } from 'src/api-documentation'
import { IApiDocumentation } from 'src/api-documentation/decorators'
import { INVALID_DTO_RESPONSE, UNAUTHORIZED_RESPONSE } from 'src/api-documentation/responses'

import { AuthMessage } from './messages'
import { AuthDto } from '../dto/auth.dto'
import { Tokens } from '../dto/tokens.dto'
import { AuthUserDto } from '../dto/auth-user.dto'

export const SIGNUP_DOCUMENTATION: IApiDocumentation = {
  operation: { summary: 'Creating new user.' },
  body: {
    type: AuthDto,
  },
  responses: [
    {
      status: HttpStatus.CREATED,
      type: StandardResponse(AuthUserDto, {
        statusCode: HttpStatus.CREATED,
        message: AuthMessage.SIGNUP,
      }),
    },
    INVALID_DTO_RESPONSE,
    UNAUTHORIZED_RESPONSE,
  ],
  tags: [ApiTag.public],
}

export const SIGNIN_DOCUMENTATION: IApiDocumentation = {
  operation: { summary: 'Getting user by credentials.' },
  body: {
    type: AuthDto,
  },
  responses: [
    { status: HttpStatus.OK, type: StandardResponse(AuthUserDto) },
    INVALID_DTO_RESPONSE,
    UNAUTHORIZED_RESPONSE,
  ],
  tags: [ApiTag.public],
}

export const LOGOUT_DOCUMENTATION: IApiDocumentation = {
  operation: { summary: 'Logout.' },
  responses: [
    {
      status: HttpStatus.OK,
      description: 'Logout.',
      type: StandardResponse(Boolean, {
        message: AuthMessage.LOGOUT,
      }),
    },
    UNAUTHORIZED_RESPONSE,
  ],
  isBearerAuth: true,
}

export const REFRESH_DOCUMENTATION: IApiDocumentation = {
  operation: { summary: 'Getting new access token.' },
  responses: [
    {
      status: HttpStatus.OK,
      type: StandardResponse(Tokens, {
        message: AuthMessage.REFRESH,
      }),
    },
    UNAUTHORIZED_RESPONSE,
  ],
  isBearerAuth: true,
}

export const ME_DOCUMENTATION: IApiDocumentation = {
  operation: { summary: 'Getting current user data by access token.' },
  responses: [
    { status: HttpStatus.OK, type: StandardResponse(AuthUserDto) },
    UNAUTHORIZED_RESPONSE,
  ],
  isBearerAuth: true,
}
