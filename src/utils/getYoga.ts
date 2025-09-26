import { createYoga } from "graphql-yoga";
import { Request } from "express";
import { redis } from "../redis";
import { schema } from "./schema";

export const getYoga = () => {
  return createYoga({
    schema: schema as any,
    context: ({ request }: { request: Request }) => {
      // Извлекаем host из headers или headersInit
      const host =
        request.headers["host"] ||
        (request.headers as any).headersInit?.host ||
        "localhost:4000";
      const protocol = request.protocol || "http";
      const url = `${protocol}://${host}`;
      return {
        redis,
        url,
      };
    },
  });
};
