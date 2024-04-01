import { HttpStatus } from '@nestjs/common'
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'

export const requestSchema: (
  messageSchema: SchemaObject | ReferenceObject,
  errorMessage: string,
  statusCode: HttpStatus
) => SchemaObject = (messageSchema, errorMessage, statusCode) => ({
  type: 'object',
  properties: {
    message: messageSchema,
    error: { type: 'string', example: errorMessage },
    statusCode: { type: 'number', example: statusCode },
  },
})
