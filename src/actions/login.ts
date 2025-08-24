'use server';

import { LoginSchema } from "@/schema";
import z from "zod";

export const LoginAction = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: validatedData.error, message: "Invalid login data" };
  }

  return { success: true, message: "Login successful" };
};
