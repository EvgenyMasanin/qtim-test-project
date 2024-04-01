import { HttpStatus } from '@nestjs/common'
import { ApiResponseOptions } from '@nestjs/swagger'

import { StandardResponse } from 'src/common/dto'
import { Constructor } from 'src/common/interfaces'
import { DefaultMessage } from 'src/common/decorators'

import { IApiDocumentation } from '../decorators'
import { FORBIDDEN_RESPONSE, NOT_FOUND_RESPONSE, UNAUTHORIZED_RESPONSE } from '../responses'

interface IUpdateCommonDocumentation {
  entity: Constructor
  entityName: string
  message?: string
  responses?: ApiResponseOptions[]
}

export const UPDATE_COMMON_DOCUMENTATION = ({
  entity,
  entityName,
  message = DefaultMessage.SUCCESS,
  responses = [],
}: IUpdateCommonDocumentation): IApiDocumentation => ({
  operation: { summary: `Updating ${entityName}.` },
  responses: [
    {
      status: HttpStatus.OK,
      type: StandardResponse(entity, {
        message,
      }),
    },
    NOT_FOUND_RESPONSE(entityName),
    FORBIDDEN_RESPONSE,
    UNAUTHORIZED_RESPONSE,
    ...responses,
  ],

  isBearerAuth: true,
})
