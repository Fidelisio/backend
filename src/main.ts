import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';
import { init } from 'Helpers/init.helper';

async function bootstrap() {
    const app = init(await NestFactory.create(AppModule));

    const configService = app.select(AppModule).get(ConfigService);

    await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
