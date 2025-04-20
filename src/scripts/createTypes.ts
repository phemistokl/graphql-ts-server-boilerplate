import { generateNamespace } from "@gql2ts/from-schema";
import { join } from "path";
import * as fs from "fs";
import { schema } from "../utils/schema";

const typescriptTypes = generateNamespace("GQL", schema);

fs.writeFile(join(process.cwd(), "src/types/schema.d.ts"), typescriptTypes, (a) => {
    console.log("✔️ Types successfully generated!", a);
});
