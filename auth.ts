import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes in seconds
  },
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

        // If user doesn't exist
        if (!user) {
          return null;
        }

        // Skip password check for social auth users
        if (user.password) {
          // Check password for credential-based users
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user.password,
          );

          if (!isPasswordValid) {
            return null;
          }
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Only run this logic for social logins
      console.log("signIn callback:----------------------------------------", {
        user,
      });
      if (account && account.provider !== "credentials" && user.email) {
        try {
          // Check if a user with this email already exists
          const existingUser = await prisma.user.findUnique({
            where: {
              email: user.email,
            },
            include: {
              accounts: true,
            },
          });

          // If user exists but doesn't have an account with this provider
          if (existingUser) {
            // Check if this provider is already linked
            const linkedAccount = existingUser.accounts.find(
              (acc) => acc.provider === account.provider,
            );

            // If not linked, create the link now
            if (!linkedAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state as string,
                },
              });
            }

            // Use the existing user's ID for this session
            user.id = existingUser.id;
            return true;
          } else {
            // If user doesn't exist, create a new one
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                fullName: user.name || `User-${Date.now()}`,
                image: user.image,
                hasCreatedProfile: false,
              },
            });

            // Use the new user's ID for this session
            user.id = newUser.id;
            return true;
          }
        } catch (error) {
          console.error("Error during social auth sign in:", error);
          return false;
        }
      }
      return true;
    },

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

      // For social auth users, make sure we have the latest profile data
      if (token.email) {
        const currentUser = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });

        if (currentUser) {
          token.id = currentUser.id;
          token.hasCreatedProfile = currentUser.hasCreatedProfile;
          token.name = currentUser.fullName;
          token.picture = currentUser.image;
        }
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
  events: {
    async createUser(message) {
      // This event is triggered when a new user is created
      // You can add additional setup logic here if needed
      console.log("New user created:", message.user.id);
    },
    async linkAccount({ user, account, profile }) {
      console.log("linkAccount callback:", { user, account, profile });
      // This event is triggered when a new account is linked to a user
      console.log(`Account linked: ${account.provider} for user ${user.id}`);
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
