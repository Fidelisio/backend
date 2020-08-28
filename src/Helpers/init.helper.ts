import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AuthGuard } from 'Infrastructure/middlewares/auth.guard';

export function init(app: INestApplication): INestApplication {
    app.useGlobalPipes(
        new ValidationPipe({
            forbidUnknownValues: true,
            transform: true,
            whitelist: true,
        }),
    );
    app.useGlobalGuards(new AuthGuard(app.get(Reflector)));
    useContainer(app, { fallbackOnErrors: true });

    return app;
}
