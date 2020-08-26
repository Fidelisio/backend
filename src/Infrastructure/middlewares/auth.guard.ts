import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as JWTAuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard extends JWTAuthGuard('jwt') implements CanActivate {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    public canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

        if (isPublic) {
            return true;
        }

        // Make sure to check the authorization, for now, just return false to have a difference between public routes.
        return super.canActivate(context);
    }
}
