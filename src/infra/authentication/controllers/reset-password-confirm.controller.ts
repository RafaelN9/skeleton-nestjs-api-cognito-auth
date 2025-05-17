import { Controller, Post, Body, HttpCode } from "@nestjs/common";

import { ResetPasswordConfirmService } from "@/infra/authentication/services/reset-password-confirm.service";

import {
  resetPasswordConfirmSchema,
  ResetPasswordConfirmDto,
} from "@/infra/authentication/validations/reset-password-confirm.schema";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";

@Controller("auth")
export class ResetPasswordConfirmController {
  constructor(
    private resetPasswordConfirmService: ResetPasswordConfirmService,
  ) {}

  @HttpCode(200)
  @Post("password-reset-confirm")
  async resetPasswordConfirm(
    @Body(new ZodValidationPipe(resetPasswordConfirmSchema))
    data: ResetPasswordConfirmDto,
  ) {
    return await this.resetPasswordConfirmService.execute({
      email: data.email,
      new_password: data["new-password"],
      code: data["confirmation-code"],
    });
  }
}
