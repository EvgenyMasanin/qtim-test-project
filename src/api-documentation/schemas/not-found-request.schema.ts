import { HttpStatus } from '@nestjs/common'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

import { requestSchema } from './request.schema'

export const notFoundRequestSchema: (
  messageSchema: SchemaObject | ReferenceObject
) => SchemaObject = (messageSchema) =>
  requestSchema(messageSchema, 'Not Found', HttpStatus.NOT_FOUND)
