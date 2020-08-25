import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { RegistrationDTO } from 'CRM/dtos/registration.dto';
import { IUser } from 'CRM/models/user.model';
import { RegistrationUsecase } from 'CRM/usecases/registration.usecase';
import { Public } from 'Infrastructure/decorators/public.decorator';
import { PasswordInterceptor } from 'Infrastructure/middlewares/password.interceptor';

@Controller()
export class RegisterController {
    constructor(private readonly registrationEvent: RegistrationUsecase) {}

    @Post('public/register')
    @UseInterceptors(new PasswordInterceptor())
    @Public()
    public async register(@Body() registrationDTO: RegistrationDTO): Promise<IUser> {
        return await this.registrationEvent.execute(registrationDTO);
    }
}
