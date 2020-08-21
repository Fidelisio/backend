import { Module } from "@nestjs/common";
import { CustomersController } from "CRM/Http/customers.controller";
import { UsersController } from "CRM/Http/users.controller";

@Module({
    controllers: [
        CustomersController,
        UsersController
    ]
})
export class HttpModule { }