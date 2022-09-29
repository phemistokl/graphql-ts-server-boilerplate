import * as fs from "fs";
import * as path from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { mergeSchemas, makeExecutableSchema } from "@graphql-tools/schema";
import { join } from "path";
import { GraphQLSchema } from "graphql";

export const genSchema = ()  => {
const schemas: GraphQLSchema[] = [];
  const folders = fs.readdirSync(path.join(__dirname, "../modules"));
  folders.forEach((folder) => {
    const { resolvers } = require(`../modules/${folder}/resolvers`);
    const typeDefs = loadSchemaSync(
      join(__dirname, `../modules/${folder}/schema.graphql`),
      {
        loaders: [new GraphQLFileLoader()],
      }
    );
    schemas.push(makeExecutableSchema({
      typeDefs,
      resolvers,
    }));
  });

  return mergeSchemas({ schemas })
}