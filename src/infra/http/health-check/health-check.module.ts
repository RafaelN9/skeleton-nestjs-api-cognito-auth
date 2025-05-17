import { Module } from "@nestjs/common";

import { HealthCheckController } from "@/infra/http/health-check/health-check.controller";

@Module({
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
