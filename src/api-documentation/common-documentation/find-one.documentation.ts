import { HttpStatus } from '@nestjs/common'
import { ApiResponseOptions } from '@nestjs/swagger'

import { StandardResponse } from 'src/common/dto'
import { Constructor } from 'src/common/interfaces'
import { DefaultMessage } from 'src/common/decorators'

import { NOT_FOUND_RESPONSE } from '../responses'
import { IApiDocumentation } from '../decorators'
import { ApiTag } from '../tags/api-tag.enum'

interface IUpdateCommonDocumentation {
  entity: Constructor
  entityName: string
  message?: string
  responses?: ApiResponseOptions[]
}

export const FIND_ONE_COMMON_DOCUMENTATION = ({
  entity,
  entityName,
  message = DefaultMessage.SUCCESS,
  responses = [],
}: IUpdateCommonDocumentation): IApiDocumentation => ({
  operation: { summary: `Updating ${entityName} by id.` },
  responses: [
    { status: HttpStatus.OK, type: StandardResponse(entity, { message }) },
    NOT_FOUND_RESPONSE(entityName),
    ...responses,
  ],
  tags: [ApiTag.public],
})
