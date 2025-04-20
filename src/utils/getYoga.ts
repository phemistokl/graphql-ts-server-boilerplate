import { createYoga } from "graphql-yoga";
import { Request } from "express";
import { redis } from "../redis";
import { schema } from "./schema";

export const getYoga = () => {
  return createYoga({
    schema: schema as any,
    context: ({ request }: { request: Request }) => ({
      redis,
      url: request.protocol + "://" + request.headers["host"],
    }),
  });
};
