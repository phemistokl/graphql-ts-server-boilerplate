import { createServer } from "node:http";
import { join } from "node:path";
import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";

import { GetDataSource } from "./utils/getDataSource";

const { loadFilesSync } = require("@graphql-tools/load-files");

export const startServer = async () => {
  const yoga = createYoga({
    schema: createSchema({
      typeDefs: loadSchemaSync(join(__dirname, "modules/**/*.graphql"), {
        loaders: [new GraphQLFileLoader()],
      }),
      resolvers: loadFilesSync(join(__dirname, "modules/**/resolvers.*")),
    }),
  });

  const server = createServer(yoga);

  await GetDataSource().initialize();
  const app = await server.listen(4000, () =>
    console.info("Server is running on http://localhost:4000/graphql")
  );

  return app;
};
