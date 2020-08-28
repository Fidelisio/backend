import { Allow, IsOptional } from 'class-validator';

export class ClientAddressDTO {
    @Allow()
    @IsOptional()
    name?: string;

    @Allow()
    @IsOptional()
    streetAddress?: string;

    @Allow()
    @IsOptional()
    state?: string;

    @Allow()
    @IsOptional()
    city?: string;

    @Allow()
    @IsOptional()
    zipCode?: string;

    @Allow()
    @IsOptional()
    country?: string;

    @Allow()
    @IsOptional()
    note?: string;
}
