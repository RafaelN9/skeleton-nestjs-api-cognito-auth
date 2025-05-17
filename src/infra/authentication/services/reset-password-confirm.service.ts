import { Injectable } from "@nestjs/common";

import { CognitoAuthenticationProvider } from "@/core/providers/authentication/provider/cognito-authentication.provider";

interface Request {
  email: string;
  new_password: string;
  code: string;
}

@Injectable()
export class ResetPasswordConfirmService {
  constructor(
    private cognitoAuthenticationProvider: CognitoAuthenticationProvider,
  ) {}

  async execute({ email, new_password, code }: Request) {
    return await this.cognitoAuthenticationProvider.passwordResetConfirm({
      email,
      newPassword: new_password,
      code,
    });
  }
}
