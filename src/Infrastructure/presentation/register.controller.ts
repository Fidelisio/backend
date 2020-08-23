import { Body, Controller, Post } from '@nestjs/common';
import { RegistrationDTO } from 'CRM/dtos/registration.dto';
import { IUser } from 'CRM/models/user.model';
import { RegistrationUsecase } from 'CRM/usecases/registration.usecase';

@Controller()
export class RegisterController {
    constructor(private readonly registrationEvent: RegistrationUsecase) {}

    @Post('public/register')
    public async register(@Body() registrationDTO: RegistrationDTO): Promise<IUser> {
        return await this.registrationEvent.execute(registrationDTO);
    }
}
