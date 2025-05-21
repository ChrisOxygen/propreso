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
import { useState, useEffect } from "react";
import { useSignup } from "@/hooks/useSignup";
import { signupFormSchema } from "@/formSchemas";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import InBoxLoader from "@/components/InBoxLoader";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { status } = useSession();
  const router = useRouter();

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { onSubmit, isLoading, error } = useSignup();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return <InBoxLoader />;
  }

  if (error) {
    form.setError("email", {
      type: "manual",
      message: error.message,
    });
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (status === "unauthenticated") {
    return (
      <div className="mx-auto w-full max-w-lg">
        <div className="mb-10 text-center">
          <h1 className="mb-2 font-[Poppins] text-3xl font-semibold tracking-[-0.72px] text-[#2C2C2C]">
            Create your account
          </h1>
          <p className="font-[Lato] text-base font-normal tracking-[0.08px] text-[#404040]">
            Start crafting better proposals today
          </p>
        </div>

        {/* Social Sign Up Options */}
        <div className="mb-8 flex flex-col gap-3">
          <Button
            variant="outline"
            className="flex h-11 w-full gap-2 font-[Lato] font-medium"
          >
            <FaGoogle className="text-lg" />
            <span>Sign up with Google</span>
          </Button>
          <Button
            variant="outline"
            className="flex h-11 w-full gap-2 font-[Lato] font-medium"
          >
            <FaGithub className="text-lg" />
            <span>Sign up with GitHub</span>
          </Button>
        </div>

        <div className="my-8 grid w-full grid-cols-3 items-center">
          <Separator className="w-full" />
          <span className="px-2 text-center font-[Lato] text-sm text-[#404040]">
            or sign up with email
          </span>
          <Separator className="w-full" />
        </div>

        {/* Sign Up Form with Shadcn components */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-[Lato] text-[#2C2C2C]">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
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
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-[Lato] text-[#2C2C2C]">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        {...field}
                        className="font-[Lato]"
                      />
                    </FormControl>
                    <FormMessage className="font-[Lato]" />
                  </FormItem>
                )}
              />
            </div>
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
                        placeholder="Create a password"
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
                  <FormMessage className="font-[Lato]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-[Lato] text-[#2C2C2C]">
                    Confirm Password
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
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
                  <FormMessage className="font-[Lato]" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-11 w-full bg-[#BF4008] font-[Lato] text-lg font-medium tracking-[0.28px] text-white transition-colors duration-200 hover:bg-[#BF4008]/80"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Create Account"}
            </Button>
          </form>
        </Form>

        <p className="mt-8 text-center font-[Lato] text-base font-normal tracking-[0.08px] text-[#404040]">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#2C2C2C]">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return <InBoxLoader />;
}

export default SignupPage;
