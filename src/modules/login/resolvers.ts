import * as bcrypt from "bcryptjs";
import { IResolvers } from "@graphql-tools/utils";

import { User } from "../../entity/User";
import { confirmEmailError, invalidLogin } from "./errorMessages";

const errorResponse = [
  { 
    path: "email",
    message: invalidLogin
  }
];

export const resolvers: IResolvers = {
  Query: {
    bye: () => "bye"
  },
  Mutation: {
    login: async (
      _,
      {email, password}: GQL.ILoginOnMutationArguments, 
    ) => {
      const user = await User.findOne({
        where: { email }
      });

      if (!user) {
        return  errorResponse;
      }

      if (!user.confirmed) {
        return [{
          path: "email",
          message: confirmEmailError
        }]
      }

      const valid = await bcrypt.compare(password, user.password);
      

      if (!valid) {
        return  errorResponse;
      }

      await user.save();

      // await sendEmail(email, await createConfirmEmailLink(url, user.id as string, redis));

      return null;
    },
  },
};
