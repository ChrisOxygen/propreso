import { z } from "zod";

// Define the signup form schema
export const signupFormSchema = z
  .object({
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

export const projectSchema = z.object({
  projects: z
    .array(
      z.object({
        title: z.string().min(1, "Project title is required"),
        liveLink: z.string().url("Must be a valid URL").or(z.literal("")),
        githubLink: z.string().url("Must be a valid URL").or(z.literal("")),
        description: z
          .string()
          .min(10, "Description should be at least 10 characters")
          .max(3000, "Description should not exceed 3000 characters"),
      }),
    )
    .min(1, "At least one project is required")
    .max(4, "Maximum of 4 projects allowed"),
});

export const VerifyCodeSchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export const SocialUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  image: z.string().url().optional().nullable(),
  provider: z.string(),
  providerAccountId: z.string(),
});
