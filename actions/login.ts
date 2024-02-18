"use server";
import * as yup from "yup";
import { LoginSchema } from "@schemas";
import { signIn } from "@auth";
import { DEFAULT_LOGIN_REDIRECT } from "@routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@data/user";
import { generateTwoFactorToken, generateVerificationToken } from "@lib/tokens";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@lib/mail";
import { getTwoFactorTokenByEmail } from "@data/two-factor-token";
import { db } from "@lib/db";
import { getTwoFactorConfirmationByUserId } from "@data/two-factor-confirmation";

export const login = async(values: yup.InferType<typeof LoginSchema>, callbackUrl?: string | null, ) => {
    const ValidatedFields = await LoginSchema.validate(values);

    if(!ValidatedFields) {
        return { error: "Invalid  Fields Data!"};
    }

    const { email, password, code } = ValidatedFields;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.password || !existingUser.email) {
      return { error: "Email doesn't exist !"};
    }

    if(!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail( email, verificationToken.token );
      return { success: "Confirmation Email sent !"}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email) {
      if(code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

        if(twoFactorToken?.token !== code) return { error: "Invalid code!" }

        const hasExpired = new Date(twoFactorToken.expires_at) < new Date();
        if(hasExpired) return { error: "code expired!" }

        await db.twoFactorToken.delete({ where: {id: twoFactorToken.id }});
        const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if(existingConfirmation) {
          await db.twoFactorConfirmation.delete({ where: {id: existingConfirmation.id}})
        }
        await db.twoFactorConfirmation.create({ data: { userId: existingUser.id }})
      } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email)
      await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);
      
      return { twoFactor: true };
      }
    }

    try {
      await signIn("credentials", { email, password, redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT, });
    } catch (error) {
        if(error instanceof AuthError){
            switch(error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid Credentials!"};
                default:
                    return { error: "Something went wrong!"};
            }
        }
        throw error;
    }
    return null;
}