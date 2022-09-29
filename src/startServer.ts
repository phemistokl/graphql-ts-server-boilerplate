import * as Redis from "ioredis";
import * as express from "express";
import { createServer } from "@graphql-yoga/node";


import { createAppDataSource } from "./utils/createAppDataSource";
import { User } from "./entity/User";
import { genSchema } from "./utils/genSchema";

export const startServer = async () => {
  const redis = new Redis();

  const server = createServer({
    schema: genSchema(),
    context: ({ request }) => ({ redis, url: "http://" + request.headers.get("host") })
  });

  const expressApp = express();

  expressApp.use('/graphql', server);

  expressApp.get("/confirm/:id", async (req, res) => {
    const { id } = req.params;
    const userId: string = await redis.get(id) || "";

    if (userId) {
      await User.update({ id: userId }, {confirmed: true });
      redis.del(id);
      res.send("ok");
    } else {
      res.send("invalid");
    }
    
  });

  await createAppDataSource();

  const app = await server.start();

  return app;
};
