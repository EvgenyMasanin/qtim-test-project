import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'

import { AppModule } from './app.module'
import { AccessTokenGuard } from './auth/guards'
import { EnvService } from './env/env.service'
import { StandardResponseInterceptor } from './common/interceptors/standard-response'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const swaggerConfig = new DocumentBuilder()
    .setTitle('qtim-test-project')
    .setDescription('This is a test project for qtim.')
    .addBearerAuth()
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)

  SwaggerModule.setup('api/docs', app, document)

  const reflector = new Reflector()

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  )
  app.useGlobalGuards(new AccessTokenGuard(reflector))
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector),
    new StandardResponseInterceptor(reflector)
  )

  const envService = app.get(EnvService)

  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
