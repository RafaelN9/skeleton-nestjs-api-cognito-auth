import { Controller, Post, Body, HttpCode } from "@nestjs/common";

import { ResetPasswordService } from "@/infra/authentication/services/reset-password.service";

import {
  resetPasswordSchema,
  ResetPasswordDto,
} from "@/infra/authentication/validations/reset-password.schema";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";

@Controller("auth")
export class ResetPasswordController {
  constructor(private resetPasswordService: ResetPasswordService) {}

  @HttpCode(200)
  @Post("password-reset")
  async resetPassword(
    @Body(new ZodValidationPipe(resetPasswordSchema)) data: ResetPasswordDto,
  ) {
    return await this.resetPasswordService.execute({
      email: data.email,
    });
  }
}
