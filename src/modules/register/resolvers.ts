import * as bcrypt from "bcryptjs";
import * as yup from "yup";
import { ResolveMap } from "../../types/graphql-utils";
import { User } from "../../entity/User";
import { formatYupError } from "../../utils/formatYupError";
import { duplicateEmail, emailNotLongerEnough, invalidEmail, passwordNotLongEnough } from "./errorMessages";
import { createConfirmEmailLink } from "../../utils/createConfirmEmailLink";
import { sendEmail } from "../../utils/sendEmail";

const schema = yup.object().shape({
  email: yup.string().min(3, emailNotLongerEnough).max(255).email(invalidEmail),
  password: yup.string().min(3, passwordNotLongEnough).max(255),
});

interface IRegisterOnMutationArguments {
  email: string;
  password: string;
}

export const resolvers: ResolveMap = {
  Mutation: {
    register: async (_: any, args: IRegisterOnMutationArguments, { redis, url }) => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      const { email, password } = args;

      const userAlreadyExist = await User.findOne({
        where: { email },
        select: ["id"],
      });

      if (userAlreadyExist) {
        return [
          {
            path: "email",
            message: [duplicateEmail],
          },
        ];
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = User.create({
        email,
        password: hashedPassword,
      });

      await user.save();

      if (process.env.NODE_ENV !== "test") {
        await sendEmail("phemistokl@gmail.com", await createConfirmEmailLink(url, user.id, redis));
      }

      return null;
    },
  },
};
