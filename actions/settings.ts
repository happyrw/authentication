"use server";

import { getUserByEmail, getUserById } from '@data/user';
import { currentUser } from '@lib/auth';
import { db } from '@lib/db';
import { sendVerificationEmail } from '@lib/mail';
import { generateVerificationToken } from '@lib/tokens';
import { settingSchema } from '@schemas';
import bcrypt from 'bcryptjs';
import * as yup from 'yup';

export const settings = async(values: yup.InferType<typeof settingSchema>) => {
    const user = await currentUser();
    console.log("user", user);
    if(!user) {
        return { error: "Unauthorized and Not user"}
    }
    if(!user.id) {
        return null;
    }
    const dbUser = await getUserById(user.id);
    console.log("dbUser", dbUser);
    if(!dbUser) {
        return { error: "Unauthorized and Not dbUser"}
    }

    if(user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }

    if(values.email && values.email !== dbUser.email) {
        const existingUser = await getUserByEmail(values.email);
        if(existingUser) {
            return { error: "Email already in use!" };
        }

        const verificationToken = await generateVerificationToken(values.email);
        await sendVerificationEmail(values.email, verificationToken.token);

        return { success: "Confirmation Email sent!" };
    }

    if(values.password && values.newPassword && dbUser.password){
        const passwordMatch = await bcrypt.compare(values.password, dbUser.password);
        if(!passwordMatch) {
            return { error: "Incorrect password!" };
        }
        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        values.password = hashedPassword;
    }
    
    await db.user.update({
        where: { id: dbUser.id },
        data: {
          email: values.email,
          name: values.name,
          role: values.role,
          isTwoFactorEnabled: values.isTwoFactorEnabled,
          password: values.password ? values.password : undefined,
        },
      });

    return { success: "Settings Updated!" };
}


{/*

const generateVerificationToken = (email: string) => {
    const token = uuid();
    const expires_at = new Date() + 3600 * 1000;

    const existingToken = await getTokenByEmail(email);
    
    if(existingToken) {
        await db.verificationToken.delete({ where: { id: existingToken.id }})
    }

    const verificationToken = await db.verificationToken.create({ 
        where: { email },
        data: {
            email,
            token,
            expires_at
        }
    })

    return verificationToken;
}

*/}