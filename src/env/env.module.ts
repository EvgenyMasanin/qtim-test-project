import { ConfigModule } from '@nestjs/config'
import { DynamicModule, Module } from '@nestjs/common'

import { EnvService } from './env.service'

@Module({
  providers: [EnvService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  exports: [EnvService],
})
export class EnvModule {
  static register(): DynamicModule {
    return {
      module: EnvModule,
      imports: [],
      exports: [ConfigModule],
    }
  }
}
