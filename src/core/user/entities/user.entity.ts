import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Exclude } from 'class-transformer'
import { RoleEntity } from 'src/core/role/entities/role.entity'
import { ArticleEntity } from 'src/core/article/entities/article.entity'

@Entity('users')
export class UserEntity {
  @ApiProperty({ example: 42 })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: 'test@gmail.com' })
  @Column({ unique: true })
  email: string

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[]

  @Column()
  @Exclude()
  password: string

  @ApiProperty({ type: () => [RoleEntity] })
  @ManyToMany(() => RoleEntity, { eager: true })
  @JoinTable()
  roles: RoleEntity[]

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string
}
