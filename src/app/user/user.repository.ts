import { Client, Repository } from "redis-om";
import { injectable, inject } from "inversify";

import { TYPES } from "../../types";
import { UserModel, UserModelSchema } from "./user.model";
import { CreateUserDto, UpdateUserDto } from "./user.dto";

export interface UserRepository {
  findById(id: string): Promise<UserModel>;
  findByEmail(email: string): Promise<UserModel>;
  create(user: CreateUserDto): Promise<UserModel>;
  update(id: string, user: UpdateUserDto): Promise<string>;
  delete(id: string): Promise<void>;
}

export interface UserRepositoryDependencies {
  dbClient: Client;
}

@injectable()
export class RedisUserRepository implements UserRepository {
  private repository: Repository<UserModel>;

  constructor(@inject(TYPES.DbClient) dbClient: Client) {
    this.repository = dbClient.fetchRepository(UserModelSchema);
    this.repository.createIndex();
  }

  async findById(id: string): Promise<UserModel> {
    return this.repository.fetch(id);
  }

  async findByEmail(email: string) {
    return this.repository.search().where("email").eq(email).return.first();
  }

  async create(createUser: CreateUserDto) {
    return this.repository.createAndSave({
      name: createUser.name,
      email: createUser.email,
      password: createUser.password,
    });
  }

  async update(id: string, updateUser: UpdateUserDto) {
    const user = await this.repository.fetch(id);

    user.name = updateUser.name;
    user.email = updateUser.email;
    user.password = updateUser.password;

    return this.repository.save(user);
  }

  async delete(id: string) {
    return this.repository.remove(id);
  }
}
