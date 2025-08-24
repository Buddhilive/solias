import z from "zod";

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Password is required"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.email(),
    password: z
      .string()
      .min(4, "Password is required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(4, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
