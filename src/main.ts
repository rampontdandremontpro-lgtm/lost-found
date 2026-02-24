import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildGlobalValidationPipe } from './core/http/validation/validation.pipe';
import { HttpExceptionFilter } from './core/http/exceptions/http-exception.filter';
import { ResponseInterceptor } from './core/http/interceptors/reponse.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(buildGlobalValidationPipe()); 
  app.useGlobalFilters(new HttpExceptionFilter()); 
  app.useGlobalInterceptors(new ResponseInterceptor()); 

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
