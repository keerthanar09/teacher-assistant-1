import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/drive",
        },
      },
    }),
  ],
  callbacks: {
    // 1️⃣ Allow sign-in only if user exists in the `User` table
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      return !!existingUser; // Allow sign-in if user exists, otherwise reject
    },

    // 2️⃣ Store role, ID & accessToken in JWT
    async jwt({ token, user, account }) {
      if (user) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (existingUser) {
          token.role = existingUser.role; // "teacher" or "student"
          token.dbId = existingUser.id; 
        }
      }

      // Store Google access token for later use with Google Forms
      if (account) {
        token.accessToken = account.access_token;
      }

      return token;
    },

    // 3️⃣ Add role, dbId & accessToken to session
    async session({ session, token }) {
      session.user.role = token.role; // Assign user role
      session.user.dbId = token.dbId; // Assign user ID from database
      session.accessToken = token.accessToken; // Store Google API token

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export default NextAuth(authOptions);
