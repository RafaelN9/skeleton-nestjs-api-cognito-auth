import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { passportJwtSecret } from "jwks-rsa";
import { z } from "zod";
import { Injectable } from "@nestjs/common";

import { EnvService } from "@/infra/env/env.service";

const userPayload = z.object({
  sub: z.string(),
  "cognito:groups": z.array(z.string()).optional(),
});

type UserPayload = z.infer<typeof userPayload>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private envService: EnvService) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          envService.get("AWS_COGNITO_AUTHORITY") + "/.well-known/jwks.json",
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      _audience: envService.get("AWS_COGNITO_CLIENT_ID"),
      issuer: envService.get("AWS_COGNITO_AUTHORITY"),
      algorithms: ["RS256"],
      userInfo: true,
    });
  }

  validate(payload: UserPayload) {
    return userPayload.parse(payload);
  }
}
