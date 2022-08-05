import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { interfaces, Principal } from "inversify-express-utils";

import { TYPES } from "../types";
import { UserService } from "../app/user/user.service";
import { UserModel } from "../app/user/user.model";

const userService = inject(TYPES.UserService);

class PrincipalUser implements Principal {
  public details: Partial<UserModel> | null;

  public constructor(details: UserModel | null) {
    this.details = details && details.toJSON();
  }

  public isAuthenticated(): Promise<boolean> {
    return Promise.resolve(!!this.details);
  }

  public isResourceOwner(userId: string): Promise<boolean> {
    return Promise.resolve(userId === this.details?.id);
  }

  public isInRole(role: string): Promise<boolean> {
    return Promise.resolve(role === "admin" && !!this.details);
  }
}

@injectable()
export class AuthProvider implements interfaces.AuthProvider {
  @userService private readonly userService: UserService;

  public async getUser(
    req: Request,
    _res: Response,
    _next: NextFunction
  ): Promise<Principal> {
    const userId = req.headers["auth-token"];

    if (!userId || typeof userId !== "string") {
      return new PrincipalUser(null);
    }

    try {
      const user = await this.userService.getUser(userId);
      return new PrincipalUser(user);
    } catch (_e) {
      return new PrincipalUser(null);
    }
  }
}
