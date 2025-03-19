import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Define the extended user type returned by authorize
interface ExtendedUser {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  hasCreatedProfile: boolean;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        // If user doesn't exist or doesn't have a password (OAuth user)
        if (!user || !user.password) {
          return null;
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Return the user object that will be stored in the token
        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          image: user.image,
          hasCreatedProfile: user.hasCreatedProfile,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        // Cast user to ExtendedUser type
        const typedUser = user as ExtendedUser;

        return {
          ...token,
          id: typedUser.id,
          hasCreatedProfile: typedUser.hasCreatedProfile,
        };
      }

      // Return previous token if the user data hasn't changed
      return token;
    },
    async session({ session, token }) {
      // Add user ID and hasCreatedProfile to the session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.hasCreatedProfile = token.hasCreatedProfile as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes in seconds
  },

  cookies: {
    sessionToken: {
      name: "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "none",
        path: "/",
        secure: true,
        domain:
          process.env.NODE_ENV === "production"
            ? "https://propreso.vercel.app/" // Use your actual domain
            : "localhost",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
