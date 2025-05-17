import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";

import { CognitoService } from "@/infra/authentication/cognito.service";

export class UserData {
  email: string;
  sub: string;
  [key: string]: string;
}

export const GetUser = createParamDecorator(
  async (data: unknown, ctx: ExecutionContext): Promise<UserData> => {
    const request = ctx.switchToHttp().getRequest();

    const cognitoService = request.cognitoService as CognitoService;

    if (!request.headers.authorization) {
      throw new UnauthorizedException("No token provided");
    }
    const accessToken: string = request.headers.authorization.split(" ")[1];

    const userInfo = await cognitoService.getUserInfo(accessToken);

    const userAttributes = {} as UserData;

    userInfo["UserAttributes"].forEach((attribute) => {
      userAttributes[attribute.Name] = attribute.Value;
    });

    return userAttributes;
  },
);
