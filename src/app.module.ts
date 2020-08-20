import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CrmModule } from './CRM/crm.module';
import { InfrastructureModule } from './Infrastructure/infrastructure.module';
import { AuthModule } from './Auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGODB_URI'),
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: true,
            }),
            inject: [ConfigService],
        }),
        // business modules
        InfrastructureModule,
        AuthModule,
        CrmModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
