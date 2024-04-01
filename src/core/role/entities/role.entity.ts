import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { Role } from 'src/auth/constants'

@Entity('roles')
export class RoleEntity {
  @ApiProperty({ example: 42 })
  @PrimaryGeneratedColumn()
  id: number

  @ApiProperty({ example: Role.USER })
  @Column()
  name: string
}
