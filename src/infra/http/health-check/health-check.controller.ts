import { Controller, Get } from "@nestjs/common";

@Controller("healthcheck")
export class HealthCheckController {
  @Get()
  healthCondition() {
    return "live";
  }
}
