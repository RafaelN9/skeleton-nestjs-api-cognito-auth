import { NestFactory } from "@nestjs/core";
import { EnvService } from "@/infra/env/env.service";
import { CognitoInterceptor } from "@/interceptors/cognito.interceptor";
import { CognitoService } from "@/infra/authentication/cognito.service";

import { AppModule } from "@/app.module";
import * as bodyParser from "body-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

  const envService = app.get(EnvService);

  if (envService.get("API_ENV") !== "PROD") {
    app.enableCors({
      origin: "*",
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      allowedHeaders: "*",
      credentials: true,
    });
  } else {
    app.enableCors({
      origin: ["*"],
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
      allowedHeaders: "*",
      credentials: true,
    });
  }

  const cognitoService = app.get(CognitoService);
  app.useGlobalInterceptors(new CognitoInterceptor(cognitoService));
  const port = envService.get("PORT");

  await app.listen(port);
}
bootstrap().catch(console.error);
