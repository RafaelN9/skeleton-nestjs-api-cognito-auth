import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

import { dataSourceOptions } from "@/core/database/ormconfig";

import { envSchema } from "@/infra/env/env";
import { HttpModule } from "@/domain/http.module";
import { InfraModule } from "./infra/infra.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => {
        if (env.NODE_ENV === "test") return env;
        return envSchema.parse(env);
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    HttpModule,
    InfraModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply()
      .exclude(
        { path: "/auth/*path", method: RequestMethod.ALL },
        { path: "*", method: RequestMethod.GET },
      )
      .forRoutes("*");
  }
}
