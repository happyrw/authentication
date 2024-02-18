"use server"
import * as yup from "yup";
import { RegisterSchema } from "@schemas";
import bcrypt from "bcryptjs";
import { db } from "@lib/db";
import { getUserByEmail } from "@data/user";
import { generateVerificationToken } from "@lib/tokens";
import { sendVerificationEmail } from "@lib/mail";

export const registration = async (values: yup.InferType<typeof RegisterSchema>) => {
    const validatedFields = await RegisterSchema.validate(values);

    if (!validatedFields) {
        return { error: "Invalid Fields Data!" };
    }

    const { name, email, password } = validatedFields;

    if (!password) {
        return { error: "Password is required!" };
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const existingUser = await getUserByEmail(email); // check if user already exists (email)
    if(existingUser) {
        return { error: "User already exists!" };
    }
    await db.user.create({ data: { name, email, password: hashedPassword } });
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail( email, verificationToken.token );
    return { success: "Confirmation Email sent !" };
};
