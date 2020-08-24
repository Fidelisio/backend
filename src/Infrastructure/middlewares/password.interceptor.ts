import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class PasswordInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                data.password = undefined;

                return data;
            }),
        );
    }
}
