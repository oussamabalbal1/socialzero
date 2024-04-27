import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    //importing validation so we can using DTO for data validation
    //ensuring all endpoints are protected from receiving incorrect data
    app.useGlobalPipes(new ValidationPipe(
      {
        //whitelist the acceptable properties only based on DTO
        whitelist:true,
        //only properties that whitelisted in the DTO will be allowed, 
        //and any additional properties not listed in the DTO will trigger a validation error
        forbidNonWhitelisted:true
      }
    ))
  await app.listen(3000);
}
bootstrap();
