import { Controller, Post, Body, HttpCode } from "@nestjs/common";

import { SignInService } from "@/infra/authentication/services/sign-in.service";

import {
  signInSchema,
  SignInDto,
} from "@/infra/authentication/validations/sign-in.schema";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";

@Controller("auth")
export class SignInController {
  constructor(private signInService: SignInService) {}

  @HttpCode(200)
  @Post("signin")
  async signIn(@Body(new ZodValidationPipe(signInSchema)) data: SignInDto) {
    return await this.signInService.execute({
      email: data.email,
      password: data.password,
    });
  }
}
