import { Injectable } from "@nestjs/common";

import { CognitoAuthenticationProvider } from "@/core/providers/authentication/provider/cognito-authentication.provider";

interface Request {
  email: string;
}

@Injectable()
export class SignUpConfirmResendService {
  constructor(
    private cognitoAuthenticationProvider: CognitoAuthenticationProvider,
  ) {}

  async execute({ email }: Request) {
    return await this.cognitoAuthenticationProvider.resendConfirmationCode({
      email,
    });
  }
}
