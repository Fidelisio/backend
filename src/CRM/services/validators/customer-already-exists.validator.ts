import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { ICustomerRepository } from 'CRM/repositories/customers.repository';

@ValidatorConstraint({ name: CustomerAlreadyExists.name, async: true })
@Injectable()
export class CustomerAlreadyExists implements ValidatorConstraintInterface {
    constructor(private readonly customerRepository: ICustomerRepository) {}

    async validate(value: string): Promise<boolean> {
        if (!value?.length) {
            return false;
        }

        return !(await this.customerRepository.findByName(value));
    }

    defaultMessage?(): string {
        return 'customerName.taken';
    }
}
