import { Module } from "@nestjs/common";
import { DataController } from "./controllers/data/data.controller";

@Module({
  imports: [],
  controllers: [DataController],
  providers: [],
})
export class AppModule {}
