import { ApiProperty } from '@nestjs/swagger'

import { Constructor } from 'src/common/interfaces'

import { PaginationDto } from './pagination.dto'

export interface IWithPagination<T> {
  data: T[]
  pagination: PaginationDto
}

export function WithPagination<Entity extends Constructor>(Entity: Entity) {
  class _WithPagination implements IWithPagination<Entity> {
    @ApiProperty({ type: [Entity] })
    data: Entity[]
    @ApiProperty()
    pagination: PaginationDto
  }

  Object.defineProperty(_WithPagination, 'name', {
    value: `${Entity.name}_WithPagination`,
  })

  return _WithPagination
}
