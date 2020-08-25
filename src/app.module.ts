import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'Auth/auth.module';
import { CrmModule } from 'CRM/crm.module';
import { InfrastructureModule } from 'Infrastructure/infrastructure.module';

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
})
export class AppModule {}
