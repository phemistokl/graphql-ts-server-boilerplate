import fetch from "node-fetch";
import { Redis } from "ioredis";

import { User } from "../entity/User";
import { host } from "../tests/constants";
import { GetDataSource } from "./getDataSource";
import { createConfirmEmailLink } from "./createConfirmEmailLink";
  
let userId = "";
const redis = new Redis();

beforeAll(async () => {
  await GetDataSource().initialize();
  const user = await User.create({
    email: `test_${Date.now()}@example.com`,
    password: "afadfscxscvsmfdfdsfdm4",
  }).save();
  userId = user.id;
});

afterAll(async () => {
  if (GetDataSource().isInitialized) {
    await GetDataSource().destroy();
  }
});

describe("test createConfirmEmailLink", () => {
  test("Make sure createConfirmEmailLink works", async () => {
    const url = await createConfirmEmailLink(host, userId, redis);

    const response = await fetch(url);
    const text = await response.text();
    expect(text).toEqual("ok");
    const user = await User.findOne({ where: { id: userId }});
    expect((user as User).confirmed).toBeTruthy();
    const chunks = url.split("/");
    const key = chunks[chunks.length - 1];
    const value = await redis.get(key);
    expect(value).toBeNull();
  });

  test("sends invalid back if bad id sent", async () => {
    const response = await fetch(`${host}/confirm/12083`);
    const text = await response.text();
    expect(text).toEqual("invalid");
  });
});
