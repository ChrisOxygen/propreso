"use client";

import Link from "next/link";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { loginFormSchema } from "@/formSchemas";
import InBoxLoader from "@/components/InBoxLoader";
import { useLogin } from "@/hooks/useLogin";
import useSocialSignIn from "@/hooks/useSocialSignIn";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { onSubmit, isLoading, error } = useLogin();
  const { mutate: signInWithProvider, isPending: isSocialSignInPending } =
    useSocialSignIn();

  // Initialize form
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Show loading state while checking session
  if (isLoading || isSocialSignInPending) {
    return <InBoxLoader />;
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Only show the login form if not authenticated
  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-10 text-center">
        <h1 className="mb-2 font-[Poppins] text-3xl font-semibold tracking-[-0.72px] text-[#2C2C2C]">
          Log in to your account
        </h1>
        <p className="font-[Lato] text-base font-normal tracking-[0.08px] text-[#404040]">
          Welcome back to your proposal workspace
        </p>
      </div>

      {/* Social Login Options */}
      <div className="mb-8 flex flex-col gap-3">
        <Button
          onClick={() => signInWithProvider("google")}
          disabled={isSocialSignInPending}
          variant="outline"
          className="flex h-11 w-full gap-2 font-[Lato] font-medium"
        >
          <FaGoogle className="text-lg" />
          <span>Log in with Google</span>
        </Button>
        <Button
          onClick={() => signInWithProvider("github")}
          disabled={isSocialSignInPending}
          variant="outline"
          className="flex h-11 w-full gap-2 font-[Lato] font-medium"
        >
          <FaGithub className="text-lg" />
          <span>Log in with GitHub</span>
        </Button>
      </div>

      <div className="my-8 grid w-full grid-cols-3 items-center">
        <Separator className="w-full" />
        <span className="px-2 text-center font-[Lato] text-sm text-[#404040]">
          or log in with email
        </span>
        <Separator className="w-full" />
      </div>

      {/* Login Form with Shadcn components */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 font-[Lato] text-red-700">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-[Lato] text-[#2C2C2C]">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    className="font-[Lato]"
                  />
                </FormControl>
                <FormMessage className="font-[Lato]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-[Lato] text-[#2C2C2C]">
                  Password
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      className="font-[Lato]"
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute top-1/2 right-3 -translate-y-1/2 transform text-[#404040] hover:text-[#2C2C2C]"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-1 flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="font-[Lato] text-sm font-medium text-[#2C2C2C] transition-colors duration-200 hover:text-[#BF4008]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormMessage className="font-[Lato]" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full bg-[#BF4008] font-[Lato] text-lg font-medium tracking-[0.28px] text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
          >
            {isLoading ? "Loading..." : "Log in"}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center font-[Lato] text-base font-normal tracking-[0.08px] text-[#404040]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-[#2C2C2C] transition-colors duration-200 hover:text-[#BF4008]"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
