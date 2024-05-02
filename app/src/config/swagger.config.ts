import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
    .setTitle('App')
    .setDescription('App API description')
    .setVersion('0.1')
    .build()

