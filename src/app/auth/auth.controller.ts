import {
  controller,
  httpGet,
  httpPost,
  requestBody,
} from "inversify-express-utils";
import { inject } from "inversify";
import { body } from "../../utils/validation"

import { TYPES } from "../../types";
import { validationMiddleware } from "../..//middleware/validation.middleware";
import { AuthService } from "./auth.service";
import { AuthRegisterDto, AuthLoginDto } from "./auth.dto";

const registerValidationRules = () => {
  return [
    body<AuthRegisterDto>("name").isString().notEmpty().withMessage("must be a string"),
    body<AuthRegisterDto>("email").isEmail().withMessage("must be a valid email"),
    body<AuthRegisterDto>("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 characters"),
  ];
};

const loginValidationRules = () => {
  return [
    body<AuthLoginDto>("email").isEmail().withMessage("must be a valid email"),
    body<AuthLoginDto>("password")
      .isLength({ min: 5 })
      .withMessage("must be at least 5 characters"),
  ];
};

@controller("/auth")
export class AuthController {
  constructor(@inject(TYPES.AuthService) private authService: AuthService) {}

  @httpPost("/register", validationMiddleware(registerValidationRules()))
  public registerUser(@requestBody() registerUser: AuthRegisterDto) {
    return this.authService.registerUser(registerUser);
  }

  @httpGet("/login", validationMiddleware(loginValidationRules()))
  public async login(@requestBody() loginUser: AuthLoginDto) {
    return this.authService.loginUser(loginUser);
  }
}
