// "use server";
import NextAuth, { Session, User } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@lib/db";
import authConfig from "@auth.config";
import { getUserById } from "@data/user";
import { getTwoFactorConfirmationByUserId } from "@data/two-factor-confirmation";
import { getAccountByUserId } from "@data/account";

type AdapterUser = any

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
      signIn: "/auth/login",
      error: "/auth/error",
  },
  events: {
    async linkAccount({ user }){
      await db.user.update({ 
        where: { id: user.id }, 
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account, }: { user: User | AdapterUser; account: any; }) {
      //allow OAuth with out email verification
      if (!account || account.provider !== "credentials") return true;
      const existingUser = await getUserById(user.id);
      //prevent signIn withou email verification
      if (!existingUser?.emailVerified) return false;
      if(existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if(!twoFactorConfirmation) return false;

        //TODO: delete two factor for next signIn

        await db.twoFactorConfirmation.delete({ where: { id: twoFactorConfirmation.id }})
      }
      return true;
    },
    async session({ session, token}: {session: Session, token?: any}) { // from https://github.com/sahilq312
      if (token?.sub) session.user.id = token.sub;
      if (token?.role) session.user.role = token.role;
      if(session.user){
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if(session.user){
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.isOAuth = token.isOAuth;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token?.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
