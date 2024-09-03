import { Module } from "@nestjs/common";
import { PomeziLoginController } from "./controllers/login/pomezi/pomezi-login.controller";
import { TokenService } from './services/token/token.service';

@Module({
  controllers: [PomeziLoginController],
  providers: [TokenService],
})
export class LoginModule {}
