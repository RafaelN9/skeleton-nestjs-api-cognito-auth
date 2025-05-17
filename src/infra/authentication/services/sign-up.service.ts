import { Injectable } from "@nestjs/common";

import { CognitoAuthenticationProvider } from "@/core/providers/authentication/provider/cognito-authentication.provider";

interface Request {
  email: string;
  password: string;
}

@Injectable()
export class SignUpService {
  constructor(
    private cognitoAuthenticationProvider: CognitoAuthenticationProvider,
  ) {}

  async execute({ email, password }: Request) {
    return await this.cognitoAuthenticationProvider.signUp({
      email,
      password,
    });
  }
}
