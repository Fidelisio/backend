import { Module } from '@nestjs/common';
import { HttpModule } from 'CRM/Http/http.module';

@Module({
    imports: [HttpModule],
})
export class CrmModule {}
