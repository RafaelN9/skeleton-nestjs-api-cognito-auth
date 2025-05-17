import { Module } from "@nestjs/common";

import { CognitoAuthenticationProvider } from "@/core/providers/authentication/provider/cognito-authentication.provider";
import { EnvService } from "@/infra/env/env.service";

@Module({
  providers: [CognitoAuthenticationProvider, EnvService],
  exports: [CognitoAuthenticationProvider],
})
export class AuthenticationProviderModule {}
