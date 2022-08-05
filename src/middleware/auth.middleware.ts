import { Request, Response, NextFunction } from "express";
import { injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";

import { UnauthorizedError } from "../errors/unauthorized.error";

@injectable()
export class AuthMiddleware extends BaseMiddleware {
  public async handler(_req: Request, _res: Response, next: NextFunction) {
    const isAuthenticated = await this.httpContext.user.isAuthenticated();

    if (!isAuthenticated) {
      return next(new UnauthorizedError("Invalid credentials"));
    }

    return next();
  }
}
