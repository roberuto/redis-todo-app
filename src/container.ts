import { Container } from "inversify";

import { TYPES } from "./types";
import { AuthService } from "./app/auth/auth.service";
import { UserService } from "./app/user/user.service";
import {
  UserRepository,
  RedisUserRepository,
} from "./app/user/user.repository";
import { TodoService } from "./app/todo/todo.service";
import {
  TodoRepository,
  RedisTodoRepository,
} from "./app/todo/todo.repository";
import { connectRedisDatabase } from "./infra/db/redis.db";
import { AuthMiddleware } from "./middleware/auth.middleware";
import "./app/auth/auth.controller";
import "./app/user/user.controller";
import "./app/todo/todo.controller";

export const createContainer = async (): Promise<Container> => {
  const container = new Container();

  const client = await connectRedisDatabase();

  container.bind(TYPES.DbClient).toConstantValue(client);
  container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware);
  container.bind<AuthService>(TYPES.AuthService).to(AuthService);
  container.bind<UserService>(TYPES.UserService).to(UserService);
  container.bind<UserRepository>(TYPES.UserRepository).to(RedisUserRepository).inSingletonScope();;
  container.bind<TodoService>(TYPES.TodoService).to(TodoService);
  container.bind<TodoRepository>(TYPES.TodoRepository).to(RedisTodoRepository).inSingletonScope();;

  return container;
};
