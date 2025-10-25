import { NestFactory } from '@nestjs/core';
import { MainModule } from '@infrastructure/main.module';
import { DomainExceptionFilter } from '@infrastructure/filters/domain-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.enableCors({
    origin: ['http://localhost:5174'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalFilters(new DomainExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
