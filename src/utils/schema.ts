import { join } from "path";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadFilesSync } from "@graphql-tools/load-files";
import { createSchema } from "graphql-yoga";

export const schema = createSchema({
  typeDefs: loadSchemaSync(join(process.cwd(), "src/modules/**/*.graphql"), {
    loaders: [new GraphQLFileLoader()],
  }),
  resolvers: loadFilesSync(join(process.cwd(), "src/modules/**/resolvers.*")),
});