import { v4 as uuidv4 } from "uuid";
import { prisma } from "./prisma";
import { getVerificationTokenByEmail } from "@/data/verification-token";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id }
    });
  }
  
  const verificationToken = await prisma.verificationToken.create({
    data: { email, token, expires },
  });

  return verificationToken;
};
