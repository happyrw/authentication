import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { LoginSchema } from "@schemas";
import { getUserByEmail } from "@data/user";
import bcrypt from "bcryptjs";

const authConfig : NextAuthConfig = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRETE,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRETE,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = await LoginSchema.validate(credentials);

                if(validatedFields) {
                    const { email, password } = validatedFields;
                    const user = await getUserByEmail(email);
                    if(!user || !user?.password) return null;
                    if(!password) return null;
                    const passwordMatch = await bcrypt.compare(password, user?.password);
                    if(passwordMatch){
                        return user;
                    }
                }
                return null;
            }
        })
    ],
}

export default authConfig;
