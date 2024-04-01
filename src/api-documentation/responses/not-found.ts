import { HttpStatus } from '@nestjs/common'
import { ApiResponseOptions } from '@nestjs/swagger'

import { notFoundRequestSchema } from '../schemas'

export const NOT_FOUND_RESPONSE: (entityName: string) => ApiResponseOptions = (entityName) =>
  ({
    status: HttpStatus.BAD_REQUEST,
    description: `Not Found`,
    schema: notFoundRequestSchema({
      type: 'string',
      example: `There is no such ${entityName}!`,
    }),
  }) as const
