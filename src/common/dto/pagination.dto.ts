import { ApiProperty } from '@nestjs/swagger'

export class PaginationDto {
  @ApiProperty({ example: 0 })
  offset: number
  @ApiProperty({ example: 10 })
  limit: number
  @ApiProperty({ example: 100 })
  total: number
}
