import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        ) {
          // اگر نام کاربری و پسورد درست بودند
          return {
            id: "1",
            name: "Admin",
            password: process.env.ADMIN_PASSWORD,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // اعتبار 7 روزه
  },
  pages: {
    signIn: "/admin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.password = user.password; // ذخیره پسورد در توکن
      } else {
        // اگر user در توکن موجود نبود (توکن از قبل وجود داشت)
        if (token.password !== process.env.ADMIN_PASSWORD) {
          // اگر پسورد تغییر کرده بود، توکن نامعتبر شود
          throw new Error("Password has changed. Please log in again.");
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
      };
      return session;
    },
  },
};
