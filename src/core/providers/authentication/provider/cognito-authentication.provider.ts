import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AuthFlowType,
  GetUserCommand,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import * as crypto from "node:crypto";
import { decode } from "jsonwebtoken";

import { AuthenticationProviderProps } from "@/core/providers/authentication/interfaces/authentication-provider.interface";

import { EnvService } from "@/infra/env/env.service";
import {
  SignInReq,
  SignInRes,
} from "@/core/providers/authentication/interfaces/sign-in.interface";
import { SignUpReq } from "@/core/providers/authentication/interfaces/sign-up.interface";
import { SignUpConfirmReq } from "@/core/providers/authentication/interfaces/sign-up-confirm.interface";
import { ResendConfirmationCodeReq } from "@/core/providers/authentication/interfaces/resend-confirmation-code.interface";
import { PasswordResetReq } from "@/core/providers/authentication/interfaces/password-reset.interface";
import { PasswordResetConfirmReq } from "@/core/providers/authentication/interfaces/password-reset-confirm.interface";
import {
  GetUserNameReq,
  GetUserNameRes,
} from "@/core/providers/authentication/interfaces/get-user-name.interface";

@Injectable()
export class CognitoAuthenticationProvider
  implements AuthenticationProviderProps
{
  private readonly client: CognitoIdentityProviderClient;
  private clientId: string;
  private clientSecret: string;

  constructor(private envService: EnvService) {
    this.client = new CognitoIdentityProviderClient({
      region: this.envService.get("AWS_COGNITO_REGION"),
    });
    this.clientId = this.envService.get("AWS_COGNITO_CLIENT_ID");
    this.clientSecret = this.envService.get("AWS_COGNITO_CLIENT_SECRET");
  }

  async getUserName({ accessToken }: GetUserNameReq): Promise<GetUserNameRes> {
    try {
      const command = new GetUserCommand({
        AccessToken: accessToken,
      });

      const response = await this.client.send(command);

      const data = response.UserAttributes.reduce(
        (accumulator, item) => {
          accumulator[item.Name] = item.Value;
          return accumulator;
        },
        {
          sub: "",
          email_verified: "",
          email: "",
        },
      );

      return data;
    } catch (error) {
      if (error.$metadata.httpStatusCode === 400) {
        if (error.__type === "NotAuthorizedException") {
          throw new UnauthorizedException("Usuário ou senha inválidos.");
        }
      }

      throw new InternalServerErrorException(error);
    }
  }

  async passwordResetConfirm({
    email,
    newPassword,
    code,
  }: PasswordResetConfirmReq): Promise<void> {
    const secretHash = this.generateSecretHash(
      email,
      this.clientId,
      this.clientSecret,
    );

    const command = new ConfirmForgotPasswordCommand({
      ClientId: this.clientId,
      SecretHash: secretHash,
      Username: email,
      Password: newPassword,
      ConfirmationCode: code,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      if (error.$metadata.httpStatusCode === 400) {
        if (error.__type === "CodeMismatchException") {
          throw new BadRequestException("Código de verificação inválido.");
        }

        if (error.__type === "InvalidPasswordException") {
          throw new BadRequestException("Senha inválida.");
        }

        if (error.__type === "ExpiredCodeException") {
          throw new BadRequestException("Código de verificação expirado.");
        }
      }

      throw new InternalServerErrorException(error);
    }
  }

  async passwordReset({ email }: PasswordResetReq): Promise<void> {
    const secretHash = this.generateSecretHash(
      email,
      this.clientId,
      this.clientSecret,
    );

    const command = new ForgotPasswordCommand({
      ClientId: this.clientId,
      SecretHash: secretHash,
      Username: email,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async resendConfirmationCode({
    email,
  }: ResendConfirmationCodeReq): Promise<void> {
    const secretHash = this.generateSecretHash(
      email,
      this.clientId,
      this.clientSecret,
    );

    const command = new ResendConfirmationCodeCommand({
      ClientId: this.clientId,
      SecretHash: secretHash,
      Username: email,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signUpConfirm({ email, code }: SignUpConfirmReq): Promise<void> {
    const secretHash = this.generateSecretHash(
      email,
      this.clientId,
      this.clientSecret,
    );

    const command = new ConfirmSignUpCommand({
      ClientId: this.clientId,
      SecretHash: secretHash,
      Username: email,
      ConfirmationCode: code,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      if (error.$metadata.httpStatusCode === 400) {
        if (error.__type === "CodeMismatchException") {
          throw new BadRequestException("Código de verificação inválido.");
        }

        if (error.__type === "ExpiredCodeException") {
          throw new BadRequestException("Código de verificação expirado.");
        }
      }

      throw new InternalServerErrorException(error);
    }
  }

  async signUp({ email, password }: SignUpReq): Promise<void> {
    const secretHash = this.generateSecretHash(
      email,
      this.clientId,
      this.clientSecret,
    );

    const command = new SignUpCommand({
      ClientId: this.clientId,
      SecretHash: secretHash,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
    });

    try {
      await this.client.send(command);
    } catch (error) {
      if (error.$metadata.httpStatusCode === 400) {
        if (error.__type === "InvalidPasswordException") {
          throw new BadRequestException("Senha inválida.");
        }

        if (error.__type === "UsernameExistsException") {
          throw new ConflictException(
            "Um usuário com esse email já foi cadastrado.",
          );
        }
      }

      throw new InternalServerErrorException(error);
    }
  }

  async signIn({ email, password }: SignInReq): Promise<SignInRes> {
    try {
      const secretHash = this.generateSecretHash(
        email,
        this.clientId,
        this.clientSecret,
      );

      const initiateAuthCommand = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: secretHash,
        },
        ClientId: this.clientId,
        ClientMetadata: {
          email,
        },
      });

      const token = await this.client.send(initiateAuthCommand);

      const getUserCommand = new GetUserCommand({
        AccessToken: token.AuthenticationResult.AccessToken,
      });

      const user = await this.client.send(getUserCommand);

      const groups = this.extractGroupsFromToken(
        token.AuthenticationResult.IdToken,
      );

      return {
        accessToken: token.AuthenticationResult.AccessToken,
        idToken: token.AuthenticationResult.IdToken,
        expiresIn: token.AuthenticationResult.ExpiresIn,
        groups,
        sub: {
          email: user.UserAttributes.find((attr) => attr.Name === "email")
            .Value,
          email_verified: user.UserAttributes.find(
            (attr) => attr.Name === "email_verified",
          ).Value,
        },
      };
    } catch (error: any) {
      if (error.$metadata.httpStatusCode === 400) {
        if (error.__type === "UserNotConfirmedException") {
          throw new BadRequestException("Usuário não confirmado.");
        }

        if (error.__type === "NotAuthorizedException") {
          throw new BadRequestException("Usuário ou senha inválidos.");
        }
      }

      throw new InternalServerErrorException(error);
    }
  }

  private generateSecretHash(
    username: string,
    clientId: string,
    clientSecret: string,
  ) {
    return crypto
      .createHmac("SHA256", clientSecret)
      .update(username + clientId)
      .digest("base64");
  }

  private extractGroupsFromToken(idToken: string): string[] {
    const decodedToken = decode(idToken);
    if (decodedToken && typeof decodedToken === "object") {
      return (decodedToken["cognito:groups"] as string[]) || [];
    }
    return [];
  }
}
