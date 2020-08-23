import { Body, Controller, Post } from '@nestjs/common';
import { RegistrationDTO } from 'CRM/dtos/registration.dto';
import { UsersService } from 'CRM/services/users.service';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('public/register')
    public async register(@Body() registrationDTO: RegistrationDTO): Promise<any> {
        return await this.usersService.register(registrationDTO);
    }
}
