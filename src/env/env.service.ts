import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Env } from './env.interface'

@Injectable()
export class EnvService {
  constructor(private readonly configService: ConfigService) {}
  get<T extends keyof Env>(key: T): Env[T] {
    return this.configService.get(key)
  }
}
