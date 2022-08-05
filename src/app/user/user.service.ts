import { injectable, inject } from "inversify";

import { ForbiddenError } from "../../errors/forbidden.error";
import { NotFoundError } from "../../errors/not-found.error";
import { UnauthorizedError } from "../../errors/unauthorized.error";
import { TYPES } from "../../types";
import { UserRepository } from "./user.repository";
import { TodoRepository } from "../todo/todo.repository";
import { UserModel } from "./user.model";
import { CreateUserDto, UpdateUserDto } from "./user.dto";

@injectable()
export class UserService {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly usersRepository: UserRepository,
    @inject(TYPES.TodoRepository)
    private readonly todoRepository: TodoRepository
  ) {}

  async registerUser(user: CreateUserDto): Promise<UserModel> {
    const currentUser = await this.usersRepository.findByEmail(user.email);

    if (currentUser) {
      throw new ForbiddenError("User already exists");
    }

    return this.usersRepository.create(user);
  }

  async getUser(id: string): Promise<UserModel> {
    const user = await this.usersRepository.findById(id);

    if (user.isNull()) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<{}> {
    const currentUser = await this.usersRepository.findById(id);

    if (!currentUser) {
      throw new NotFoundError("User not found");
    }

    await this.usersRepository.update(currentUser.id, {
      name: user.name,
      email: user.email,
      password: user.password,
    });

    return this.usersRepository.findById(currentUser.id);
  }

  async deleteUser({
    userId,
    id,
  }: {
    userId: string;
    id: string;
  }): Promise<void> {
    if (userId !== id) {
      throw new UnauthorizedError("Unauthorized");
    }

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const todos = await this.todoRepository.findByUserId(id);

    if (todos && todos.length) {
      const ids = todos.map((todo) => todo.id);
      await this.todoRepository.delete(ids);
    }

    return this.usersRepository.delete(id);
  }
}
