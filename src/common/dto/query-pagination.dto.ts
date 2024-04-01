import { ApiProperty } from '@nestjs/swagger'

import { Type } from 'class-transformer'
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator'

export class QueryPaginationDto {
  @ApiProperty({ required: false, default: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @IsPositive()
  limit?: number

  @ApiProperty({ required: false, default: 0 })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number
}
