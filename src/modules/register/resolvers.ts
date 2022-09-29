import * as bcrypt from "bcryptjs";
import { IResolvers } from "@graphql-tools/utils";

import * as yup from 'yup';

import { User } from "../../entity/User";
import { formatYupError } from "../../utils/formatYupError";
import { duplicateEmail, emailNotLongEnough, invalidEmail, passwordNotLongEnough } from "./errorMessages";
// import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
// import { sendEmail } from "../../utils/sendEmail";

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255)
});

export const resolvers: IResolvers = {
  Query: {
    bye: () => "bye"
  },
  Mutation: {
    register: async (
      _,
      args: GQL.IRegisterOnMutationArguments, 
      // { redis, url }
    ) => {

      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err as any);
      }

      const { email, password } = args;

      const userAlreadyEexists = await User.findOne({
        where: { email },
        select: ["id"]
      });

      if (userAlreadyEexists) {
        return  [
          { 
            path: "email",
            message: duplicateEmail
          }
        ];
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({ email, password: hashedPassword });

      await user.save();

      // await sendEmail(email, await createConfirmEmailLink(url, user.id as string, redis));

      return null;
    },
  },
};
