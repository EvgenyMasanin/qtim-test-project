import { HttpStatus } from '@nestjs/common'
import { ApiResponseOptions } from '@nestjs/swagger'

import { unauthorizedRequestSchema } from '../schemas'

export const UNAUTHORIZED_RESPONSE: ApiResponseOptions = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'Unauthorized user',
  schema: unauthorizedRequestSchema({ type: 'string', example: 'Unauthorized' }),
} as const
