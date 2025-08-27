'use server';

import { RegisterSchema } from "@/schema";
import z from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getUserByEmail } from "@/data/user";

export const RegisterAction = async (data: z.infer<typeof RegisterSchema>) => {
  const validatedData = RegisterSchema.safeParse(data);
  
  if (!validatedData.success) {
    return { error: validatedData.error, message: "Invalid register data" };
  }
  
  const { email, name, password } = validatedData.data;
  
  const userExists = await getUserByEmail(email);
  
  if (userExists) {
    return { error: "User already exists", message: `User with email ${email} already exists.` };
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  return { success: true, message: "Registration successful" };
};
