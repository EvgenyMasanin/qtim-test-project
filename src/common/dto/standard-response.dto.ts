import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

import { Constructor } from 'src/common/interfaces'

import { DefaultMessage } from '../decorators'

export interface IStandardResponse<T> {
  statusCode: HttpStatus
  response: T
  message: string
}

let classCounter = 1

export function StandardResponse<Entity extends Constructor>(
  Entity: Entity,
  examples?: { statusCode?: HttpStatus; message?: string }
) {
  const { message = DefaultMessage.SUCCESS, statusCode = HttpStatus.OK } = examples || {}

  class _StandardResponse implements IStandardResponse<Entity> {
    @ApiProperty({ example: statusCode })
    statusCode: number
    @ApiProperty({ example: message })
    message: string
    @ApiProperty({ type: Entity })
    response: Entity
  }

  Object.defineProperty(_StandardResponse, 'name', {
    value: `${Entity.name}_StandardResponse_${classCounter++}`,
  })

  return _StandardResponse
}
