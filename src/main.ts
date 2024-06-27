import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { checkReg } from './checkRegister';


async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    //origin: 'http://192.168.0.108:8081',
    origin: 'http://localhost:8081',
    // cors
  });
  
  app.enableCors();
  
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      //whitelist: true,
      //forbidNonWhitelisted: true,
      //transform: true,
    }),
  );

  await app.listen(3001, ()=>console.log("is running"));
  //checkMS();
  checkReg();
  
  
}
bootstrap();