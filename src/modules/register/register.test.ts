import { request } from 'graphql-request';

import { host } from '../../tests/constants';
import { User } from "../../entity/User";
import { GetDataSource } from '../../utils/getDataSource';
import { duplicateEmail, emailNotLongerEnough, invalidEmail, passwordNotLongEnough } from './errorMessages';

beforeAll(async () => {
    await GetDataSource().initialize();
});

var email = `testethrth@example.com`;
var password = "jalksa";

const mutation = (e: string, p: string) => `
mutation {
  register(email: "${e}", password: "${p}") {
    path
    message
  }
}
`;

describe("Register user", () => {
  it("check for duplicate emails", async () => {
    const response  = await request(host, mutation(email, password));
    expect(response).toEqual({ register: null });
    const users = await User.find({ where: { email }});
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const response2: any = await request(host, mutation(email, password));
    expect(response2.register).toHaveLength(1);
    expect(response2.register[0]).toEqual({
      path: "email",
      message: [duplicateEmail]
    });
  });

  it("check bad email", async () => {
    const response: any = await request(host, mutation("b", password));
    expect(response).toEqual({
      register: [
        {
          path: "email",
          message: [emailNotLongerEnough]
        },
        {
          path: "email",
          message: [invalidEmail]
        }
      ]
    });
  });

  it("check bad password", async () => {
    const response: any = await request(host, mutation(email, "fg"));
    expect(response).toEqual({
      register: [
        {
          path: "password",
          message: [passwordNotLongEnough]
        }
      ]
    });
  });

  it("check bad password and bad email", async () => {
    const response: any = await request(host, mutation("df", "fg"));
    expect(response).toEqual({
      register: [
        {
          path: "email",
          message: [emailNotLongerEnough]
        },
        {
          path: "email",
          message: [invalidEmail]
        },
        {
          path: "password",
          message: [passwordNotLongEnough]
        }
      ]
    });
  });
});
