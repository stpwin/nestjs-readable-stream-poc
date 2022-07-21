import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
    }
  });
  await app.listen(process.env.PORT ?? 9000);
  console.log(`Server started on url ${await app.getUrl()}`);
}
bootstrap();
