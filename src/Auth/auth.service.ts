import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './login.dto';
import { UserStatus } from '../CRM/Domain/user.model';
import { CustomerStatus } from '../CRM/Domain/customer.model';
import { UsersRepository } from '../Infrastructure/persistence/users.repository';


@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) { }

    public async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findByUsername(username, true);

        if (user && user.status === UserStatus.ACTIVE && user.customer.status == CustomerStatus.ACTIVE && bcrypt.compareSync(password, user.password)) {
            const { ...result } = user;
            return result;
        }

        return null;
    }

    public async login(user: LoginDTO) {
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
