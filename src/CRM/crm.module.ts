import { Module } from "@nestjs/common";
import { HttpModule } from "./Http/http.module";

@Module({
    imports: [HttpModule]
})
export class CrmModule { }