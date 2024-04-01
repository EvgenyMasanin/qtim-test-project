import { HttpStatus } from '@nestjs/common'
import { ApiResponseOptions } from '@nestjs/swagger'

import { StandardResponse } from 'src/common/dto'
import { Constructor } from 'src/common/interfaces'
import { DefaultMessage } from 'src/common/decorators'

import { IApiDocumentation } from '../decorators'
import { INVALID_DTO_RESPONSE, UNAUTHORIZED_RESPONSE } from '../responses'

interface ICreateCommonDocumentation {
  entity: Constructor
  entityName: string
  message?: string
  responses?: ApiResponseOptions[]
}

export const CREATE_COMMON_DOCUMENTATION = ({
  entity,
  entityName,
  message = DefaultMessage.SUCCESS,
  responses = [],
}: ICreateCommonDocumentation): IApiDocumentation => ({
  operation: { summary: `Creating new ${entityName}.` },
  responses: [
    {
      status: HttpStatus.CREATED,
      type: StandardResponse(entity, { statusCode: HttpStatus.CREATED, message }),
      description: `New ${entityName} has been created successfully.`,
    },
    INVALID_DTO_RESPONSE,
    UNAUTHORIZED_RESPONSE,
    ...responses,
  ],
  isBearerAuth: true,
})
