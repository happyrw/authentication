"use server";

import { getPasswordResetTokenByToken } from '@data/password-reset-token';
import { getUserByEmail } from '@data/user';
import { db } from '@lib/db';
import { NewPasswordSchema } from '@schemas';
import bcrypt from "bcryptjs";
import * as yup from 'yup';

export const newPassword = async(values: yup.InferType <typeof NewPasswordSchema>, token: string | null) => {
    
    if(!token) {
        return { error: "Missing Token!" };
    }

    const validatedFields = await NewPasswordSchema.validate(values);

    if(!validatedFields) {
        return { error: "Invalid fielsd data"};
    }
    const { password } = validatedFields;
    const existingToken = await getPasswordResetTokenByToken(token);
    console.log("existingToken", existingToken)
    if(!existingToken) {
        return { error: "Invalid token" };
    }
    const hasExpired = new Date(existingToken.expires_at) < new Date();
    if(hasExpired) {
        return { error: "Token has expired" }
    }
    if(!existingToken.email) {
        return null;
    }
    const existingUser = await getUserByEmail(existingToken.email);
    if(!existingUser) {
        return { error: "Email does not exist!"}
    }
    if(!password) return null;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({ where: { id: existingUser.id }, data: { password: hashedPassword } });
    await db.passwordResetToken.delete({ where: { id: existingToken.id }})

    return { success: "Password updated successfull !"}
}