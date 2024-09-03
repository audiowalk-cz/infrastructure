import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Config } from "./config";
import { registerOpenApi } from "./openapi";

async function bootstrap() {
  const logger = new Logger("MAIN");

  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  registerOpenApi(app);

  await app.listen(Config.server.port, Config.server.host);

  logger.log(`Server is running on ${await app.getUrl()}`);
}
bootstrap();
