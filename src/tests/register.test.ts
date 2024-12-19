import { request } from 'graphql-request';

import { host } from './constants';

const email = "bob@bob.com";
const password = "jajajaj";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test("Register user", async () => {
    const response  = await request(host, mutation);
    expect(response).toEqual({ register: true });
});
