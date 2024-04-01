import { HttpStatus } from '@nestjs/common'
import { ApiResponseOptions } from '@nestjs/swagger'

import { Constructor } from 'src/common/interfaces'
import { StandardResponse, WithPagination } from 'src/common/dto'

import { IApiDocumentation } from '../decorators'
import { INVALID_DTO_RESPONSE } from '../responses'
import { ApiTag } from '../tags/api-tag.enum'

interface IFindAllCommonDocumentation {
  entity: Constructor
  entityName: string
  responses?: ApiResponseOptions[]
  includePagination?: boolean
}

export const FIND_ALL_COMMON_DOCUMENTATION = ({
  entity,
  entityName,
  responses = [],
}: IFindAllCommonDocumentation): IApiDocumentation => ({
  operation: { summary: `Finding all ${entityName} with pagination.` },
  responses: [
    { status: HttpStatus.OK, type: StandardResponse(WithPagination(entity)) },
    INVALID_DTO_RESPONSE,
    ...responses,
  ],
  tags: [ApiTag.public],
})
