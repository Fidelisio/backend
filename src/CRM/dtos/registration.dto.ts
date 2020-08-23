import { IsString } from 'class-validator';

export class RegistrationDTO {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsString()
    customerName: string;
}
