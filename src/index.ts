import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "./entity/User";
import { startServer } from "./startServer";

export const AppDataSource = new DataSource({
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

export const AppDataSourceTest = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "albert",
  password: "",
  database: "graphql-ts-server-boilerplate-test",
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});

startServer();


