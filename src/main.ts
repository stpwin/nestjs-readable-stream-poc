import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import session from 'express-session'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    },
  })
  app.use(
    session({
      secret: 'SUPER_SECRET_KEY',
      resave: false,
      saveUninitialized: true,
    })
  )
  await app.listen(process.env.PORT ?? 9000)
  console.log(`Server started on url ${await app.getUrl()}`)
}
bootstrap()
