"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schema";
import z from "zod";
import { SoliasAlert } from "./custom/solias-alert";
import { RegisterAction } from "@/actions/register";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof RegisterSchema>) => {
    startTransition(() => {
      RegisterAction(data).then((result) => {
        if (result.error) {
          setError(result.message);
        } else {
          setSuccess("Verification email sent");
        }
      });
    });
  };

  const socialLogin = (provider: "google") => {
    signIn(provider);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Signup to your account</CardTitle>
          <CardDescription>
            Enter your email below to Signup to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <form
              className="flex flex-col gap-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  required
                  disabled={isPending}
                />
                {errors.name && (
                  <SoliasAlert title="Invalid name" variant="destructive">
                    {errors.name.message}
                  </SoliasAlert>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  required
                  disabled={isPending}
                />
                {errors.email && (
                  <SoliasAlert title="Invalid email" variant="destructive">
                    {errors.email.message}
                  </SoliasAlert>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  required
                  disabled={isPending}
                />
                {errors.password && (
                  <SoliasAlert title="Invalid password" variant="destructive">
                    {errors.password.message}
                  </SoliasAlert>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  required
                  disabled={isPending}
                />
                {errors.confirmPassword && (
                  <SoliasAlert
                    title="Invalid confirm password"
                    variant="destructive"
                  >
                    {errors.confirmPassword.message}
                  </SoliasAlert>
                )}
              </div>
              <div className="flex flex-col gap-3">
                {error && (
                  <SoliasAlert title="Login error" variant="destructive">
                    {error}
                  </SoliasAlert>
                )}
                {success && (
                  <SoliasAlert title="Success" variant="default">
                    {success}
                  </SoliasAlert>
                )}
                <Button type="submit" className="w-full" disabled={isPending}>
                  Signup
                </Button>
              </div>
            </form>
            <div className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full"
                disabled={isPending}
                onClick={() => socialLogin("google")}
              >
                Signup with Google
              </Button>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="underline underline-offset-4">
              Login
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
