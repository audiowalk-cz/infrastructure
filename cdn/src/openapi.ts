import { INestApplication, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFile } from "fs/promises";
import * as path from "path";
import { Config } from "./config";

const logger = new Logger("OpenAPI");

export async function generateOpenAPI(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(Config.project.name)
    .setDescription(Config.project.description)
    .setVersion(Config.project.version)
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  const openapiPath = path.join(__dirname, "../openapi.json");

  await writeFile(openapiPath, JSON.stringify(document, null, 2));

  logger.log(`OpenAPI document generated at ${openapiPath}`);

  return document;
}
