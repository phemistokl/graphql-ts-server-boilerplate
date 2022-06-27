import * as fs from "fs";
import * as path from "path";
import { createServer } from "@graphql-yoga/node";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { mergeSchemas, makeExecutableSchema } from "@graphql-tools/schema";
import { join } from "path";
import { GraphQLSchema } from "graphql";

import { createAppDataSource } from "./utils/createAppDataSource";

export const startServer = async () => {
  const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "./modules"));
  folders.forEach((folder) => {
    const { resolvers } = require(`./modules/${folder}/resolvers`);
    const typeDefs = loadSchemaSync(
      join(__dirname, `./modules/${folder}/schema.graphql`),
      {
        loaders: [new GraphQLFileLoader()],
      }
    );
    schemas.push(makeExecutableSchema({
      typeDefs,
      resolvers,
    }));
  });

  const server = createServer({
    schema: mergeSchemas({ schemas }),
  });

  await createAppDataSource();

  const app = await server.start();

  return app;
};
