import { IsEmail, IsNotEmpty, IsString, Length, Matches, Validate } from 'class-validator';
import { CustomerAlreadyExists } from 'CRM/services/validators/customer-already-exists.validator';
import { UsernameAlreadyExists } from 'CRM/services/validators/username-already-exists.validator';

export class RegistrationDTO {
    @IsEmail({}, { message: 'username.invalid.format' })
    @IsNotEmpty({ message: 'username.required' })
    @Validate(UsernameAlreadyExists)
    username: string;

    // If special chars are required per product requirements change pattern to :
    // /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
    @IsString()
    @IsNotEmpty({ message: 'password.required' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/, {
        message: 'password.invalid.format',
    })
    password: string;

    @IsString()
    @IsNotEmpty({ message: 'customerName.required' })
    @Length(3, 50, { message: 'customerName.invalid.format' })
    @Validate(CustomerAlreadyExists)
    customerName: string;
}
