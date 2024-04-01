import { HttpStatus } from '@nestjs/common'
import { ApiResponseOptions } from '@nestjs/swagger'

import { forbiddenRequestSchema } from '../schemas'

export const FORBIDDEN_RESPONSE: ApiResponseOptions = {
  status: HttpStatus.FORBIDDEN,
  description: 'Forbidden',
  schema: forbiddenRequestSchema({ type: 'string', example: 'Access denied!' }),
} as const
