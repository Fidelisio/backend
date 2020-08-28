import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { NewClientDTO } from 'CRM/dtos/clients';
import { IClient, IUser } from 'CRM/models';
import { IClientService } from 'CRM/services';
import { User } from 'Infrastructure/decorators';

@Controller('/clients')
export class ClientsController {
    constructor(private readonly clientsService: IClientService) {}

    @Get()
    public async list(): Promise<IClient[]> {
        throw new Error('not implemented');
    }

    @Get(':id')
    public async get(): Promise<IClient[]> {
        throw new Error('not implemented');
    }

    @Post()
    public async create(@User() user: IUser, @Body() clientDTO: NewClientDTO): Promise<IClient> {
        const clientData = {
            name: clientDTO.name,
            addresses: [clientDTO.address],
            contacts: [clientDTO.contact],
        } as IClient;

        return await this.clientsService.create(user.customer, clientData);
    }

    @Put(':id')
    public async update(): Promise<IClient> {
        throw new Error('not implemented');
    }

    @Delete(':id')
    public async delete(): Promise<any> {
        throw new Error('not implemented');
    }
}
