import { Test, TestingModule } from "@nestjs/testing";

import { HealthCheckController } from "@/infra/http/health-check/health-check.controller";

describe("Health Check Controller", () => {
  let healthCheckController: HealthCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    healthCheckController = module.get<HealthCheckController>(
      HealthCheckController,
    );
  });

  it("should be able to verify the integrity of the application", () => {
    const result = healthCheckController.healthCondition();

    expect(result).toEqual("live");
  });
});
