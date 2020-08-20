import { Controller, Get } from "@nestjs/common";
import { UsersRepository } from "src/Infrastructure/persistence/users.repository";

@Controller('/users')
export class UsersController {
    constructor(private readonly userRepository: UsersRepository) { }

    @Get()
    public async list() {
        return await this.userRepository.findAll();
    }
}