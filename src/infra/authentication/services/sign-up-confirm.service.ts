import { Injectable } from "@nestjs/common";

import { CognitoAuthenticationProvider } from "@/core/providers/authentication/provider/cognito-authentication.provider";

interface Request {
  email: string;
  code: string;
}

@Injectable()
export class SignUpConfirmService {
  constructor(
    private cognitoAuthenticationProvider: CognitoAuthenticationProvider,
  ) {}

  async execute({ email, code }: Request) {
    return await this.cognitoAuthenticationProvider.signUpConfirm({
      email,
      code,
    });
  }
}
