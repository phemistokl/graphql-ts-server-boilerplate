import { request } from 'graphql-request';

import { host } from '../../tests/constants';
import { User } from "../../entity/User";
import { GetDataSource } from '../../utils/getDataSource';

beforeAll(async () => {
    await GetDataSource().initialize();
})

const email = "tom@bob.com";
const password = "jajajaj";

const mutation = `
mutation {
  register(email: "${email}", password: "${password}")
}
`;

test("Register user", async () => {
    const response  = await request(host, mutation);
    expect(response).toEqual({ register: true });
    const users = await User.find({ where: { email }});
    expect(users).toHaveLength(1);
    const user = users[0];
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);
});
