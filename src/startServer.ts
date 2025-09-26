import { GetDataSource } from "./utils/getDataSource";
import { confirmEmail } from "./routes/confirmEmail";
import { getYoga } from "./utils/getYoga";

const express = require("express");

export const startServer = async () => {
  const server = express();

  // Включаем trust proxy для корректной обработки заголовков
  server.set('trust proxy', true);

  server.get("/graphql/confirm/:id", confirmEmail);

  server.use("/graphql", getYoga());

  await GetDataSource().initialize();
  const app = await server.listen(4000, () =>
    console.info("Server is running on http://localhost:4000/graphql")
  );

  return app;
};
