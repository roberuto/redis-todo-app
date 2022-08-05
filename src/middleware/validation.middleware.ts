import { validationResult, ValidationChain } from "express-validator";

export const validationMiddleware = (validations: ValidationChain[]) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      error: errors.array().map((err) => ({ [err.param]: err.msg })),
    });
  };
};
