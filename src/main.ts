import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Config } from "./config";
import { registerOpenApi } from "./openapi";

async function bootstrap() {
  const logger = new Logger("MAIN");

  const app = await NestFactory.create(AppModule);

  registerOpenApi(app);

  await app.listen(Config.server.port, Config.server.host);

  logger.log(`Server is running on ${await app.getUrl()}`);
}
bootstrap();
