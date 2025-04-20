import fetch from "node-fetch";
import { host } from "../tests/constants";

test("sends invalid back if bad id sent", async () => {
  const response = await fetch(`${host}/confirm/12083`);
  const text = await response.text();
  expect(text).toEqual("invalid");
});
