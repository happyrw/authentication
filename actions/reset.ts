"use server";
import * as yup from "yup";
import { ResetSchema } from "@schemas";
import { getUserByEmail } from "@data/user";
import { generatePasswordResetToken } from "@lib/tokens";
import { sendPasswordResetEmail } from "@lib/mail";

export const reset = async(values: yup.InferType<typeof ResetSchema> ) => {
    const ValidatedFields = await ResetSchema.validate(values);

    if(!ValidatedFields) {
        return { error: "Invalid Email"};
    }

    const { email } = ValidatedFields;

    const existingUser = await getUserByEmail(email);

    if(!existingUser) {
      return { error: "Email doesn't exist !"};
    }
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail( email, passwordResetToken.token);
    return { success: "Reset Email sent !"}
}