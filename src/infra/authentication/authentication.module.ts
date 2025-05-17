import { Global, Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { APP_INTERCEPTOR } from "@nestjs/core";

import { JwtStrategy } from "@/infra/authentication/jwt.strategy";
import { EnvModule } from "@/infra/env/env.module";
import { CognitoInterceptor } from "@/interceptors/cognito.interceptor";

import { CognitoService } from "@/infra/authentication/cognito.service";

import { SignInController } from "@/infra/authentication/controllers/sign-in.controller";
import { SignUpController } from "@/infra/authentication/controllers/sign-up.controller";
import { SignUpConfirmController } from "@/infra/authentication/controllers/sign-up-confirm.controller";
import { SignUpConfirmResendController } from "@/infra/authentication/controllers/sign-up-confirm-resend.controller";
import { ResetPasswordController } from "@/infra/authentication/controllers/reset-password.controller";
import { ResetPasswordConfirmController } from "@/infra/authentication/controllers/reset-password-confirm.controller";

import { SignInService } from "@/infra/authentication/services/sign-in.service";
import { SignUpService } from "@/infra/authentication/services/sign-up.service";
import { SignUpConfirmService } from "@/infra/authentication/services/sign-up-confirm.service";
import { SignUpConfirmResendService } from "@/infra/authentication/services/sign-up-confirm-resend.service";
import { ResetPasswordService } from "@/infra/authentication/services/reset-password.service";
import { ResetPasswordConfirmService } from "@/infra/authentication/services/reset-password-confirm.service";
import { AuthenticationProviderModule } from "@/core/providers/authentication/authentication-provider.module";

@Global()
@Module({
  imports: [
    EnvModule,
    AuthenticationProviderModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
  ],
  controllers: [
    SignInController,
    SignUpController,
    SignUpConfirmController,
    SignUpConfirmResendController,
    ResetPasswordController,
    ResetPasswordConfirmController,
  ],
  providers: [
    JwtStrategy,
    CognitoService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CognitoInterceptor,
    },
    SignInService,
    SignUpService,
    SignUpConfirmService,
    SignUpConfirmResendService,
    ResetPasswordService,
    ResetPasswordConfirmService,
  ],
  exports: [CognitoService],
})
export class AuthenticationModule {}
