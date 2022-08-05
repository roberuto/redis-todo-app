import {
  controller,
  httpGet,
  httpPut,
  httpPost,
  httpDelete,
  requestBody,
  requestParam,
  injectHttpContext,
  HttpContext,
} from "inversify-express-utils";
import { inject } from "inversify";

import { TYPES } from "../../types";
import { validationMiddleware } from "../..//middleware/validation.middleware";
import { TodoService } from "./todo.service";
import { CreateTodoDto, UpdateTodoDto } from "./todo.dto";
import { body } from "../../utils/validation"

const createTodoValidationRules = () => {
  return [body("title").isString().notEmpty().withMessage("must be a string")];
};

const updateTodoValidationRules = () => {
  return [
    body<UpdateTodoDto>("title").isString().notEmpty().withMessage("must be a string"),
    body<UpdateTodoDto>("isCompleted").isBoolean().withMessage("must be a bool"),
  ];
};

@controller("/todo", TYPES.AuthMiddleware)
export class TodoController {
  constructor(
    @inject(TYPES.TodoService) private todoService: TodoService,
    @injectHttpContext private readonly httpContext: HttpContext
  ) {}

  @httpPost("/", validationMiddleware(createTodoValidationRules()))
  public createTodo(@requestBody() createTodo: CreateTodoDto) {
    const userId = this.httpContext.user.details.id as string;
    return this.todoService.createTodo({ userId, createTodo });
  }

  @httpGet("/")
  public getUserTodos() {
    const userId = this.httpContext.user.details.id as string;
    return this.todoService.getUserTodos({ userId });
  }

  @httpPut("/:id", validationMiddleware(updateTodoValidationRules()))
  public updateTodo(
    @requestParam("id") todoId: string,
    @requestBody() updateTodo: UpdateTodoDto
  ) {
    const userId = this.httpContext.user.details.id as string;
    return this.todoService.updateTodo({ userId, todoId, updateTodo });
  }

  @httpDelete("/:id")
  public deleteTodo(@requestParam("id") todoId: string) {
    const userId = this.httpContext.user.details.id as string;
    return this.todoService.deleteTodo({ userId, todoId });
  }
}
