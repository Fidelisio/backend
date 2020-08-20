import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
    }));

    const configService = app.select(AppModule).get(ConfigService);

    await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
