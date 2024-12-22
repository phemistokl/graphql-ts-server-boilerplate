import { AppDataSource, TestDataSource } from "../data-source";

export const GetDataSource = () => {
    return process.env.NODE_ENV === "test" ? TestDataSource : AppDataSource;
}