import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { EnvModule } from 'src/env/env.module'
import { EnvService } from 'src/env/env.service'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        host: envService.get('POSTGRES_HOST'),
        port: envService.get('POSTGRES_PORT'),
        username: envService.get('POSTGRES_USER'),
        password: envService.get('POSTGRES_PASSWORD'),
        database: envService.get('POSTGRES_DB'),
        synchronize: false,
        entities: [],
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DbModule {}
