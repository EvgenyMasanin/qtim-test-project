import { ApiProperty } from '@nestjs/swagger'
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

import { UserEntity } from 'src/core/user/entities/user.entity'

@Entity()
export class ArticleEntity {
  @ApiProperty({ example: 42 })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: 'Some title' })
  @Column()
  title: string

  @ApiProperty({ example: 'Some description' })
  @Column()
  description: string

  @ApiProperty({ example: new Date() })
  @CreateDateColumn()
  publishedDate: Date

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.articles, { eager: true })
  author: UserEntity
}
