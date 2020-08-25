import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { IUsersRepository } from 'CRM/repositories/users.repository';

@ValidatorConstraint({ name: UsernameAlreadyExists.name, async: true })
@Injectable()
export class UsernameAlreadyExists implements ValidatorConstraintInterface {
    constructor(private readonly userRepository: IUsersRepository) {}

    async validate(value: string): Promise<boolean> {
        if (!value?.length) {
            return false;
        }

        return !(await this.userRepository.findByUsername(value));
    }

    defaultMessage?(): string {
        return 'username.exists';
    }
}
