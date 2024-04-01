import { HttpStatus } from '@nestjs/common'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

import { requestSchema } from './request.schema'

export const badRequestSchema: (messageSchema: SchemaObject | ReferenceObject) => SchemaObject = (
  messageSchema
) => requestSchema(messageSchema, 'Bad Request', HttpStatus.BAD_REQUEST)
