import { Controller, Post, Body } from "@nestjs/common";

import { SignUpService } from "@/infra/authentication/services/sign-up.service";

import {
  signUpSchema,
  SignUpDto,
} from "@/infra/authentication/validations/sign-up.schema";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";

@Controller("auth")
export class SignUpController {
  constructor(private signUpService: SignUpService) {}

  @Post("signup")
  async signUp(@Body(new ZodValidationPipe(signUpSchema)) data: SignUpDto) {
    return await this.signUpService.execute({
      email: data.email,
      password: data.password,
    });
  }
}
