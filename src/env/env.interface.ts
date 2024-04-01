export interface Env {
  // App
  PORT: number
  PRIVATE_KEY: string

  // PostgreSQL
  POSTGRES_HOST: string
  POSTGRES_USER: string
  POSTGRES_DB: string
  POSTGRES_PASSWORD: string
  POSTGRES_PORT: number

  // Redis
  REDIS_PORT: string
  REDIS_HOST: string
}
