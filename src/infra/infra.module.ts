import { Module } from "@nestjs/common";
import { AuthenticationModule } from "./authentication/authentication.module";
import { AuthenticationProviderModule } from "@/core/providers/authentication/authentication-provider.module";
import { EnvModule } from "./env/env.module";
import { HealthCheckModule } from "./http/health-check/health-check.module";

@Module({
  imports: [
    AuthenticationModule,
    AuthenticationProviderModule,
    EnvModule,
    HealthCheckModule,
  ],
  exports: [
    AuthenticationModule,
    AuthenticationProviderModule,
    EnvModule,
    HealthCheckModule,
  ],
})
export class InfraModule {}
