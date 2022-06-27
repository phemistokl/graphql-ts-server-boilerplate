import { request } from "graphql-request";

import { User } from "../../entity/User";
import { startServer } from "../../startServer";

export const host = "http://127.0.0.1:4000/graphql";

beforeAll(async () => {
  const app = await startServer();
  return app;
});

const email = "tompopup@bob.com";
const password = "dfdgggdg";

const mutation = `
    mutation {
      register(email: "${email}", password: "${password}")
    }
  `;

describe("Register user", async () => {
  it("test for duplicate emails", async () => {
    const response = await request(host, mutation);
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
    const response2: any = await request(host, mutation);
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0].path).toEqual("email");
  })
  
});
