"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { defaultUrl } from "@/routes";
import { LoginSchema } from "@/schema";
import { AuthError } from "next-auth";
import z from "zod";

export const LoginAction = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: validatedData.error };
  }

  const { email, password } = validatedData.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "User not found" };
  }

  if (!existingUser.emailVerified) {
    await generateVerificationToken(email);
    return { error: "Email not verified. Verification email sent." };
  }

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        case "OAuthAccountNotLinked":
          return { error: "OAuth account not linked" };
        case "AccessDenied":
          return { error: "Email not verified" };
        default:
          return { error: "Unknown error" };
      }
    } else {
      return { error: "Login failed" };
    }
  }

  return { success: "Login successful" };
};
