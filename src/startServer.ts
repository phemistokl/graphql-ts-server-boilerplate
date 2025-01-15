import Redis from "ioredis";
import { join } from "node:path";
import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { Request, Response } from "express";

import { GetDataSource } from "./utils/getDataSource";
import { User } from "./entity/User";

const express = require("express");
const { loadFilesSync } = require("@graphql-tools/load-files");

export const startServer = async () => {
  const redis = new Redis();
  const yoga = createYoga({
    schema: createSchema({
      typeDefs: loadSchemaSync(join(__dirname, "modules/**/*.graphql"), {
        loaders: [new GraphQLFileLoader()],
      }),
      resolvers: loadFilesSync(join(__dirname, "modules/**/resolvers.*")),
    }),
    context: ({ request }: { request: Request }) => ({ 
      redis,
      url: request.protocol + "://" + request.headers["host"]
    })
  });

  const server = express();

  server.get("/graphql/confirm/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = await redis.get(id);
    if (userId) {
      await User.update({ id: userId }, { confirmed: true });
      await redis.del(id);
      res.send("ok");
    } else {
      res.send("invalid");
    }
  });

  server.use("/graphql", yoga);

  await GetDataSource().initialize();
  const app = await server.listen(4000, () =>
    console.info("Server is running on http://localhost:4000/graphql")
  );

  return app;
};
