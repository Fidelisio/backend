import { Module } from "@nestjs/common";
import { CustomersController } from "./customers.controller";
import { UsersController } from "./users.controller";

@Module({
    controllers: [
        CustomersController,
        UsersController
    ]
})
export class HttpModule { }