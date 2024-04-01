import { HttpStatus } from '@nestjs/common'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

import { requestSchema } from './request.schema'

export const forbiddenRequestSchema: (
  messageSchema: SchemaObject | ReferenceObject
) => SchemaObject = (messageSchema) =>
  requestSchema(messageSchema, 'Forbidden', HttpStatus.FORBIDDEN)
