import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildGlobalValidationPipe } from './core/http/validation/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(buildGlobalValidationPipe())

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
