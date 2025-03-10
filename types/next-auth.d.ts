// next-auth.d.ts

import { DefaultSession } from "next-auth";
import "next-auth/jwt";

// Extend the Session interface
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      hasCreatedProfile: boolean;
    } & DefaultSession["user"];
  }
}

// // Extend JWT interface to include custom fields
// declare module "next-auth/jwt" {
//   interface JWT {
//     id: string;
//     hasCreatedProfile: boolean;
//   }
// }

// declare module "next-auth" {
//   interface AdapterUser {
//     hasCreatedProfile: boolean;
//   }
// }
