import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClientContactDTO {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    mobilePhone?: string;

    @IsString()
    @IsOptional()
    otherPhone?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    note?: string;
}
