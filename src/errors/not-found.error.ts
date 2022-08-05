import { StatusCodes } from "http-status-codes";
import { HttpError } from "./http.error";

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
