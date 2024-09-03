import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function registerOpenApi(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle("Audiowalk CDN")
    // .setDescription("The cats API description")
    // .setVersion("1.0")
    // .addTag("cats")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("/", app, document);
}
