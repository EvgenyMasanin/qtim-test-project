import { HttpStatus } from '@nestjs/common'
import { ApiResponseOptions } from '@nestjs/swagger'

import { badRequestSchema } from '../schemas'

export const INVALID_DTO_RESPONSE: ApiResponseOptions = {
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid dto',
  schema: badRequestSchema({
    type: 'array',
    items: { type: 'string' },
    example: ['validation error'],
  }),
}
