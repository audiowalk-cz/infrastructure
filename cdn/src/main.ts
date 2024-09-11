import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { Config } from "./config";
import { generateOpenAPI } from "./openapi";

async function bootstrap() {
  const logger = new Logger("MAIN");

  const app = await NestFactory.create(AppModule);

  const document = await generateOpenAPI(app);
  SwaggerModule.setup("/", app, document);

  await app.listen(Config.server.port, Config.server.host);

  logger.log(`Server is running on ${await app.getUrl()}`);
}
bootstrap();
