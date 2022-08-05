import { Client, Repository } from "redis-om";
import { injectable, inject } from "inversify";

import { TYPES } from "../../types";
import { TodoModel, TodoModelSchema } from "./todo.model";
import { CreateTodoDto, UpdateTodoDto } from "./todo.dto";

export interface TodoRepository {
  findById(id: string): Promise<TodoModel>;
  findByUserId(userId: string): Promise<TodoModel[]>;
  create(userId: string, todo: CreateTodoDto): Promise<TodoModel>;
  update(id: string, user: UpdateTodoDto): Promise<string>;
  delete(id: string | string[]): Promise<void>;
}

export interface TodoRepositoryDependencies {
  dbClient: Client;
}

@injectable()
export class RedisTodoRepository implements TodoRepository {
  private repository: Repository<TodoModel>;

  constructor(@inject(TYPES.DbClient) dbClient: Client) {
    this.repository = dbClient.fetchRepository(TodoModelSchema);
    this.repository.createIndex();
  }

  async findById(id: string) {
    return this.repository.fetch(id);
  }

  async findByUserId(userId: string) {
    return this.repository.search().where("userId").eq(userId).returnAll();
  }

  async create(userId: string, createTodo: CreateTodoDto) {
    return this.repository.createAndSave({
      ...createTodo,
      isCompleted: false,
      userId,
    });
  }

  async update(id: string, updateTodo: UpdateTodoDto) {
    const todo = await this.repository.fetch(id);

    todo.title = updateTodo.title;
    todo.isCompleted = updateTodo.isCompleted;

    return this.repository.save(todo);
  }

  async delete(id: string | string[]) {
    //@ts-ignore
    return this.repository.remove(id);
  }
}
