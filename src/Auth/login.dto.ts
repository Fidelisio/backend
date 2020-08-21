import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDTO {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}