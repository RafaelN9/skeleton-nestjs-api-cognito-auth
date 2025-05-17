import { Controller, Post, Body, HttpCode } from "@nestjs/common";

import { SignUpConfirmService } from "@/infra/authentication/services/sign-up-confirm.service";

import {
  signUpConfirmSchema,
  SignUpConfirmDto,
} from "@/infra/authentication/validations/sign-up-confirm.schema";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";

@Controller("auth")
export class SignUpConfirmController {
  constructor(private signUpConfirmService: SignUpConfirmService) {}

  @HttpCode(200)
  @Post("signup-confirm")
  async signUpConfirm(
    @Body(new ZodValidationPipe(signUpConfirmSchema)) data: SignUpConfirmDto,
  ) {
    return await this.signUpConfirmService.execute({
      email: data.email,
      code: data.code,
    });
  }
}
