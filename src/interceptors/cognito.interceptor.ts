import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";

import { CognitoService } from "@/infra/authentication/cognito.service";

@Injectable()
export class CognitoInterceptor implements NestInterceptor {
  constructor(private cognitoService: CognitoService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    request.cognitoService = this.cognitoService;
    return next.handle();
  }
}
