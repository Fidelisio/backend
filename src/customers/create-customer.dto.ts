import { IsNotEmpty,IsString, MaxLength, MinLength } from "class-validator";

export class CreateCustomerDTO {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    @IsNotEmpty()
    public readonly name: string;
}