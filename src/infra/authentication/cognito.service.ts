import {
  AdminListGroupsForUserCommand,
  CognitoIdentityProviderClient,
  GetUserCommand,
  GetUserCommandOutput,
  GroupType,
} from "@aws-sdk/client-cognito-identity-provider";
import { Injectable } from "@nestjs/common";

import { EnvService } from "@/infra/env/env.service";

@Injectable()
export class CognitoService {
  private client: CognitoIdentityProviderClient;

  constructor(private envService: EnvService) {
    this.client = new CognitoIdentityProviderClient({
      region: envService.get("AWS_COGNITO_REGION"),
    });
  }

  async getUserInfo(accessToken: string): Promise<GetUserCommandOutput> {
    const command = new GetUserCommand({
      AccessToken: accessToken,
    });

    const response = await this.client.send(command);
    return response;
  }

  async getUserGroups(
    username: string,
    userPoolId: string,
  ): Promise<GroupType[]> {
    const command = new AdminListGroupsForUserCommand({
      Username: username,
      UserPoolId: userPoolId,
    });

    const response = await this.client.send(command);
    return response.Groups || [];
  }
}
