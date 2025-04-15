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

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const { onSubmit, isLoading, error } = useLogin();

  // Initialize form
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Show loading state while checking session
  if (isLoading) {
    return <InBoxLoader />;
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Only show the login form if not authenticated
  return (
    <div className="max-w-lg mx-auto w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-black mb-2">
          Log in to your account
        </h1>
        <p className="text-gray-600">Welcome back to your proposal workspace</p>
      </div>

      {/* Social Login Options */}
      <div className="flex flex-col gap-3 mb-8">
        <Button variant="outline" className="w-full h-11 flex gap-2">
          <FaGoogle className="text-lg" />
          <span>Log in with Google</span>
        </Button>
        <Button variant="outline" className="w-full h-11 flex gap-2">
          <FaGithub className="text-lg" />
          <span>Log in with GitHub</span>
        </Button>
      </div>

      <div className="grid grid-cols-3 w-full items-center my-8">
        <Separator className="w-full" />
        <span className="text-center text-gray-500 text-sm px-2">
          or log in with email
        </span>
        <Separator className="w-full" />
      </div>

      {/* Login Form with Shadcn components */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-black hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 bg-black hover:bg-gray-800"
          >
            {isLoading ? "Loading..." : "Log in"}
          </Button>
        </form>
      </Form>

      <p className="mt-8 text-center text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-black font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
