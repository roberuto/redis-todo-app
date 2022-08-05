import {
  controller,
  httpPut,
  httpDelete,
  requestBody,
  requestParam,
  injectHttpContext,
  HttpContext,
} from "inversify-express-utils";
import { inject } from "inversify";
import { body } from "../../utils/validation"

import { TYPES } from "../../types";
import { validationMiddleware } from "../..//middleware/validation.middleware";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./user.dto";

const userValidationRules = () => {
  return [
    body<UpdateUserDto>("name").isString().notEmpty().withMessage("must be a string"),
    body<UpdateUserDto>("email").isEmail().withMessage("must be a valid email"),
    body<UpdateUserDto>("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 characters"),
  ];
};

@controller("/user", TYPES.AuthMiddleware)
export class UsersController {
  constructor(
    @inject(TYPES.UserService) private userService: UserService,
    @injectHttpContext private readonly httpContext: HttpContext
  ) {}

  @httpPut("/:id", validationMiddleware(userValidationRules()))
  public updateUser(
    @requestParam("id") id: string,
    @requestBody() updateUser: UpdateUserDto
  ) {
    return this.userService.updateUser(id, updateUser);
  }

  @httpDelete("/:id")
  public deleteUser(@requestParam("id") id: string) {
    const userId = this.httpContext.user.details.id as string;
    return this.userService.deleteUser({ userId, id });
  }
}
