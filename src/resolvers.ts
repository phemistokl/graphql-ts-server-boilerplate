import * as bcrypt from "bcryptjs";
import { ResolveMap } from "./types/graphql-utils";
import { User } from "./entity/User";
// import type * as GQL from "./types/schema";

interface IRegisterOnMutationArguments {
  email: string;
  password: string;
}

export const resolvers: ResolveMap = {
    Query: {
      hello: () => 'Hello from Yoga!'
    },
    Mutation: {
      register: async (_:any, { email, password }: IRegisterOnMutationArguments) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = User.create({
          email,
          password: hashedPassword,
        });

        await user.save();
        return true;
      }
    }
};   