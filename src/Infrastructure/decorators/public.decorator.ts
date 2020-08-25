import { SetMetadata } from '@nestjs/common';

export const Public = (): any => SetMetadata('isPublic', true);
