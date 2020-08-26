import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'Auth/login.dto';
import * as bcrypt from 'bcrypt';
import { CustomerStatus } from 'CRM/models/customer.model';
import { IUser, UserStatus } from 'CRM/models/user.model';
import { IUsersRepository } from 'CRM/repositories/users.repository';

import { JwtDTO } from './jwt.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: IUsersRepository,
        private readonly jwtService: JwtService,
    ) {}

    protected verifyUser(user: IUser): boolean {
        if (user.customer.status == undefined) {
            throw new Error('user.customer must be populated');
        }

        return user.status === UserStatus.ACTIVE && user.customer.status == CustomerStatus.ACTIVE;
    }

    protected generatePayload(user: IUser): JwtDTO {
        return {
            _id: user._id,
            username: user.username,
            customer: user.customer,
        } as JwtDTO;
    }

    public async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
        const user = await this.validateUser(loginDTO.username, loginDTO.password);

        if (user) {
            return {
                accessToken: this.jwtService.sign(this.generatePayload(user)),
            };
        }

        return null;
    }

    public async validatePayload(payload: JwtDTO): Promise<IUser> {
        const user = await this.userRepository.findByUsername(payload.username, true);

        if (user && this.verifyUser(user)) {
            return user;
        }

        return null;
    }

    public async validateUser(username: string, password: string): Promise<IUser> {
        const user = await this.userRepository.findByUsername(username, true);

        if (user && this.verifyUser(user) && bcrypt.compareSync(password, user.password)) {
            return user;
        }

        return null;
    }

    public generatePassword(userPassword: string): string {
        return bcrypt.hashSync(userPassword, 10);
    }
}
