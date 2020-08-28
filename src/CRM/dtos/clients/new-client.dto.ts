import { Type } from 'class-transformer';
import {
    IsDefined,
    IsNotEmpty,
    IsNotEmptyObject,
    IsOptional,
    IsString,
    Length,
    ValidateNested,
} from 'class-validator';
import { ClientAddressDTO, ClientContactDTO } from 'CRM/dtos/clients';

export class NewClientDTO {
    @IsString()
    @Length(3, 100)
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => ClientAddressDTO)
    address: ClientAddressDTO;

    @IsDefined()
    @IsNotEmptyObject({ message: 'contact.required' })
    @ValidateNested()
    @Type(() => ClientContactDTO)
    contact: ClientContactDTO;
}
