import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'Auth/login.dto';
import * as bcrypt from 'bcrypt';
import { CustomerStatus } from 'CRM/models/customer.model';
import { UserStatus } from 'CRM/models/user.model';
import { IUsersRepository } from 'CRM/repositories/users.repository';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: IUsersRepository,
        private readonly jwtService: JwtService,
    ) {}

    public async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findByUsername(username, true);

        if (
            user &&
            user.status === UserStatus.ACTIVE &&
            user.customer.status == CustomerStatus.ACTIVE &&
            bcrypt.compareSync(password, user.password)
        ) {
            const { ...result } = user;
            return result;
        }

        return null;
    }

    public async login(user: LoginDTO): Promise<{ accessToken: string }> {
        const isValid = await this.validateUser(user.username, user.password);

        if (isValid) {
            return {
                accessToken: this.jwtService.sign({ username: user.username }),
            };
        }

        return null;
    }

    public generatePassword(userPassword: string): string {
        return bcrypt.hashSync(userPassword, 10);
    }
}
