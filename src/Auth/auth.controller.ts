import { Body, Controller, HttpCode, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from 'Auth/auth.service';
import { LoginDTO } from 'Auth/login.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('public/auth/login')
    @HttpCode(200)
    public async login(@Body() body: LoginDTO): Promise<{ accessToken: string }> {
        const accessToken = await this.authService.login(body);
        if (null === accessToken) {
            throw new HttpException('invalid.credentials', HttpStatus.BAD_REQUEST);
        }

        return accessToken;
    }
}
