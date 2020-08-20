import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../Infrastructure/persistence/users.repository';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) { }

    public async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findByUsername(username);
        if (user && bcrypt.compareSync(password, user.password)) {
            const { ...result } = user;
            return result;
        }

        return null;
    }

    public async login(user: { username: string, password: string }) {
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
