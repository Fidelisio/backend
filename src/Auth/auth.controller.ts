import { Controller, HttpStatus, HttpException, HttpCode, Body, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('public/auth/login')
    @HttpCode(200)
    public async login(@Body() body: any) {
        const accessToken = await this.authService.login(body);
        if (null === accessToken) {
            throw new HttpException('invalid.credentials', HttpStatus.BAD_REQUEST);
        }

        return accessToken;
    }
}