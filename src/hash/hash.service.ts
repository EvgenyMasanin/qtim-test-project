import { compare, hash } from 'bcrypt'
import { Injectable } from '@nestjs/common'

@Injectable()
export class HashService {
  hashData(data: string) {
    return hash(data, 10)
  }

  compareData(data: string, hash: string) {
    return compare(data, hash)
  }
}
