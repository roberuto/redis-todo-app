import { body as expressValidatorBody } from "express-validator";

export const body = <T>(fields: keyof T) => expressValidatorBody(String(fields));
