'use server';

import { RegisterSchema } from "@/schema";
import z from "zod";

export const RegisterAction = async (data: z.infer<typeof RegisterSchema>) => {
  const validatedData = RegisterSchema.safeParse(data);

  if (!validatedData.success) {
    return { error: validatedData.error, message: "Invalid register data" };
  }

  return { success: true, message: "Login successful" };
};
