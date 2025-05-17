import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      "permissions",
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const accessToken: string =
      request.headers.authorization?.split(" ")?.[1] ?? "";

    const user = decode(accessToken);

    if (!user) {
      throw new UnauthorizedException("Unauthenticated user.");
    }

    if (user && user["cognito:groups"] && requiredPermissions.length) {
      const hasPermission = requiredPermissions.every((permission) =>
        user["cognito:groups"].includes(permission),
      );

      if (!hasPermission) {
        throw new UnauthorizedException(
          "User without permission to access this resource.",
        );
      }
    }

    return true;
  }
}
