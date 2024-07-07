import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { type DefaultSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@morpheus/db";

/**
 * Module augmentation for `next-auth` types
 * Allows us to add custom properties to the `session` object
 * and keep type safety
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 **/
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: Omit<User, "password"> & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure
 * adapters, providers, callbacks, etc.
 * @see https://next-auth.js.org/configuration/options
 **/
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const data = await prisma.user.findUnique({
          where: { id: token.sub },
        });

        if (!data) return session;
        const { password, ...user } = data;
        session.user = user;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        userName: {
          label: "Usuário",
          type: "text",
          placeholder: "nome.sobrenome",
        },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const data = await prisma.user.findUnique({
          where: {
            userName: credentials?.userName,
          },
        });
        if (data && data.password && credentials?.password) {
          const { password, ...user } = data;

          const passwordMatch = bcrypt.compareSync(
            credentials.password,
            password,
          );
          if (passwordMatch) {
            //SALVAR NO HISTÒRICO
            await prisma.log.create({
              data: {
                description: "Usuário logado com sucesso!",
                flag: "SUCCESS",
                userId: user.id,
              },
            });
            return user;
          }
          return null;
        }
        return null;
      },
    }),

    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     **/
  ],
  pages: {
    signIn: "/",
    signOut: "/auth/desconectar",
  },
};
