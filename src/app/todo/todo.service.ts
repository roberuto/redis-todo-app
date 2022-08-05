import { injectable, inject } from "inversify";

import { UnauthorizedError } from "../../errors/unauthorized.error";
import { NotFoundError } from "../../errors/not-found.error";
import { TYPES } from "../../types";
import { TodoRepository } from "./todo.repository";
import { TodoModel } from "./todo.model";
import { CreateTodoDto, UpdateTodoDto } from "./todo.dto";

@injectable()
export class TodoService {
  constructor(
    @inject(TYPES.TodoRepository)
    private readonly todoRepository: TodoRepository
  ) {}

  async createTodo({
    userId,
    createTodo,
  }: {
    userId: string;
    createTodo: CreateTodoDto;
  }): Promise<TodoModel> {
    return this.todoRepository.create(userId, createTodo);
  }

  async getUserTodos({ userId }: { userId: string }): Promise<TodoModel[]> {
    const todos = await this.todoRepository.findByUserId(userId);

    if (!todos) {
      throw new NotFoundError("Todos not found");
    }

    return todos;
  }

  async updateTodo({
    userId,
    todoId,
    updateTodo,
  }: {
    userId: string;
    todoId: string;
    updateTodo: UpdateTodoDto;
  }): Promise<TodoModel> {
    const todo = await this.todoRepository.findById(todoId);

    if (todo.isNull()) {
      throw new NotFoundError("Todo not found");
    }

    if (todo.userId !== userId) {
      throw new UnauthorizedError("User not authorized");
    }

    await this.todoRepository.update(todo.id, {
      ...updateTodo,
    });

    return this.todoRepository.findById(todoId);
  }

  async deleteTodo({
    userId,
    todoId,
  }: {
    userId: string;
    todoId: string;
  }): Promise<void> {
    const todo = await this.todoRepository.findById(todoId);

    if (todo.isNull()) {
      throw new NotFoundError("Todo not found");
    }

    if (todo.userId !== userId) {
      throw new UnauthorizedError("User not authorized");
    }

    return this.todoRepository.delete(todoId);
  }
}
