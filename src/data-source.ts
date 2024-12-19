import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

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
})
