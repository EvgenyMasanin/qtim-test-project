import { config } from 'dotenv'
import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'

import { EnvService } from '../env/env.service'

config()

const envService = new EnvService(new ConfigService())

const AppDataSource = new DataSource({
  type: 'postgres',
  host: envService.get('POSTGRES_HOST'),
  port: envService.get('POSTGRES_PORT'),
  username: envService.get('POSTGRES_USER'),
  password: envService.get('POSTGRES_PASSWORD'),
  database: envService.get('POSTGRES_DB'),
  entities: ['*/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
})

AppDataSource.initialize()
  .then(() => {
    console.log('Connection has been initialized successfully.')
  })
  .catch((err) => {
    console.log('Error during Data Source initialization:', err)
  })

export default AppDataSource
