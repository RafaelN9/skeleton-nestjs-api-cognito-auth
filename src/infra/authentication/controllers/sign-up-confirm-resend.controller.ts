import { Controller, Post, Body, HttpCode } from "@nestjs/common";

import { SignUpConfirmResendService } from "@/infra/authentication/services/sign-up-confirm-resend.service";

import {
  signUpConfirmResendSchema,
  SignUpConfirmResendDto,
} from "@/infra/authentication/validations/sign-up-confirm-resend.schema";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";

@Controller("auth")
export class SignUpConfirmResendController {
  constructor(private signUpConfirmResendService: SignUpConfirmResendService) {}

  @HttpCode(200)
  @Post("signup-confirm-resend")
  async signUpConfirmResend(
    @Body(new ZodValidationPipe(signUpConfirmResendSchema))
    data: SignUpConfirmResendDto,
  ) {
    return await this.signUpConfirmResendService.execute({
      email: data.email,
    });
  }
}
