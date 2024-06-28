import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter';
import * as cookieParser from 'cookie-parser';
import { tokenCon } from './common/middlewares/tokenCon';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://diplee.com',
      'http://diplee.com',
      'http://admin.diplee.com',
      'https://admin.diplee.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  app.use(tokenCon);
  await app.listen(5000);
}
bootstrap();
