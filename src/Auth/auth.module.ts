import { Module, Global } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from "./auth.controller";

@Global()
@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
            }),
            inject: [ConfigService],
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule { }