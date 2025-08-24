import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schema";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedData = LoginSchema.safeParse(credentials);
        if (validatedData.success) {
          const { email, password } = validatedData.data;
          const user = await getUserByEmail(email);
          if (!user || !user?.password) {
            return null;
          }
          const isPasswordMatched = await bcrypt.compare(password, user.password);
          if (isPasswordMatched) {
            return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
