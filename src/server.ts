import "reflect-metadata";
import { InversifyExpressServer } from "inversify-express-utils";
import * as express from "express";
import { errorHandler } from "./middleware/error.middleware";
import { AuthProvider } from "./middleware/auth.provider";

import { createContainer } from "./container";

const startServer = async () => {
  const container = await createContainer();

  process.on("uncaughtException", (e) => {
    console.log(e)
    process.exit(1);
  });

  process.on("unhandledRejection", (e) => {
    console.log(e)
    process.exit(1);
  });

  const server = new InversifyExpressServer(container, null, null, null, AuthProvider);

  server.setConfig((app) => {
    app.use(express.json());
  });

  server.setErrorConfig((app) => {
    app.use(errorHandler);
  });

  const app = server.build();

  app.listen(3000);

  console.log("Server started on port 3000");
};

startServer();
