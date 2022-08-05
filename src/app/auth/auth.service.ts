import { injectable, inject } from "inversify";

import { ForbiddenError } from "../../errors/forbidden.error";
import { UnauthorizedError } from "../../errors/unauthorized.error";
import { TYPES } from "../../types";
import { UserRepository } from "../user/user.repository";
import { AuthRegisterDto, AuthLoginDto } from "./auth.dto";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly usersRepository: UserRepository
  ) {}

  async registerUser(auth: AuthRegisterDto): Promise<{ token: string }> {
    const currentUser = await this.usersRepository.findByEmail(auth.email);

    if (currentUser) {
      throw new ForbiddenError("User already exists");
    }

    const user = await this.usersRepository.create(auth);

    return { token: user.id};
  }

  async loginUser(auth: AuthLoginDto): Promise<{ token: string }> {
    const user = await this.usersRepository.findByEmail(auth.email);

    if (!user || user.isNull() || auth.password !== user.password) {
      throw new UnauthorizedError("Invalid credentials");
    }

    return { token: user.id };
  }
}
