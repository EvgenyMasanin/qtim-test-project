import { ApiProperty } from '@nestjs/swagger'

import { TimePeriod } from 'src/common/enums'
import { QueryPaginationDto } from 'src/common/dto'
import { IsEnum, IsOptional, IsString } from 'class-validator'

export class FilterDto extends QueryPaginationDto {
  @ApiProperty({ required: false, description: 'Partial user title' })
  @IsString()
  @IsOptional()
  title?: string

  @ApiProperty({ required: false, enum: TimePeriod, example: TimePeriod.Daily })
  @IsEnum(TimePeriod)
  @IsOptional()
  timePeriod?: TimePeriod

  @ApiProperty({ required: false, description: 'Partial user email' })
  @IsString()
  @IsOptional()
  author?: string
}
