import { createServer } from "node:http";
import { join } from "node:path";
import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { resolvers } from "./resolvers";
import { GetDataSource } from "./utils/getDataSource";

export const startServer = async () => {
  const yoga = createYoga({
    schema: createSchema({
      typeDefs: loadSchemaSync(join(__dirname, "schema.graphql"), {
        loaders: [new GraphQLFileLoader()],
      }),
      resolvers: resolvers,
    }),
  });

  const server = createServer(yoga);

  await GetDataSource().initialize();
  await server.listen(4000, () => console.info("Server is running on http://localhost:4000/graphql"));
};

startServer();
