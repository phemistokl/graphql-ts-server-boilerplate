import { createServer } from "node:http";
import { join } from "node:path";
import { createSchema, createYoga } from "graphql-yoga";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { resolvers } from "./resolvers";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

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
  const myDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "albert",
    password: "",
    database: "graphql-ts-server-boilerplate",
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
  });

  await myDataSource.initialize();
  await server.listen(4000, () => console.info("Server is running on http://localhost:4000/graphql"));
};

startServer();
