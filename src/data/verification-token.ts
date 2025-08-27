import { prisma } from "@/lib/prisma";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    return await prisma.verificationToken.findUnique({
      where: { token },
    });
  } catch (error) {
    console.error("Error fetching verification token:", error);
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    return await prisma.verificationToken.findFirst({
      where: { email },
    });
  } catch (error) {
    console.error("Error fetching verification token:", error);
    return null;
  }
};
