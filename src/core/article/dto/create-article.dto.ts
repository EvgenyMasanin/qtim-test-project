import { ApiProperty } from '@nestjs/swagger'

import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class CreateArticleDto {
  @ApiProperty({ example: 'Some title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  title: string

  @ApiProperty({ example: 'Some description' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  description: string
}
