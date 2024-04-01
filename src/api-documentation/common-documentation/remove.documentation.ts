import { HttpStatus } from '@nestjs/common'
import { ApiResponseOptions } from '@nestjs/swagger'

import { StandardResponse } from 'src/common/dto'
import { DefaultMessage } from 'src/common/decorators'

import { IApiDocumentation } from '../decorators'
import { FORBIDDEN_RESPONSE, NOT_FOUND_RESPONSE, UNAUTHORIZED_RESPONSE } from '../responses'

interface IRemoveCommonDocumentation {
  entityName: string
  message?: string
  responses?: ApiResponseOptions[]
}

export const REMOVE_COMMON_DOCUMENTATION = ({
  entityName,
  message = DefaultMessage.SUCCESS,
  responses = [],
}: IRemoveCommonDocumentation): IApiDocumentation => ({
  operation: { summary: `Deleting ${entityName}.` },
  responses: [
    { status: HttpStatus.OK, type: StandardResponse(Boolean, { message }) },
    FORBIDDEN_RESPONSE,
    UNAUTHORIZED_RESPONSE,
    NOT_FOUND_RESPONSE(entityName),
    ...responses,
  ],
  isBearerAuth: true,
})
