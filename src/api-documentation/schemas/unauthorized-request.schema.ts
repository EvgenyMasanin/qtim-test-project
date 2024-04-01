import { HttpStatus } from '@nestjs/common'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

import { requestSchema } from './request.schema'

export const unauthorizedRequestSchema: (
  messageSchema: SchemaObject | ReferenceObject
) => SchemaObject = (messageSchema) =>
  requestSchema(messageSchema, 'Unauthorized', HttpStatus.UNAUTHORIZED)
