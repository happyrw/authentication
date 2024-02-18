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
const form = useForm({
    resolver = yupResolver(LoginSchema),
    defaultValues{
        nam:'',
        email:''
    }
});

const { register, handleSubmit, formState: { errors }} = form;

const onSubmit = (data) => {
    login(data)
        .then((data) => {
            // data.error
            // data.success
        })
}

<form onSubmit={handleSubmit(onSubmit)}>
<input
    type="text"
    placeholder="Placeholder"
    {...register("name")}
    disale={isPending}
/>

<input
    type="email"
    placeholder="Placeholder"
    {...register("email")}
    disale={isPending}
/>
</form>

const export LoginSchema = yup.object({
    email: yup.string().email("Invalid email format!").required("Email is required!"),
})

interface FormErrorProps{
    message: string,
}

export const FormError = ({ message } : FormErrorProps ) => {
    if(!message){
        return null;
    }

    return(
        <p className="">{message}</p>
    )
}

interface FormSuccessProps{
    message: string,
}

export const FormSuccess = ({ message } : FormSuccessProps ) => {
    if(!message){
        return null;
    }

    return(
        <p className="">{message}</p>
    )
}

export const login = async(values: yup.InferType<typeof LoginSchema>) => {
    const validatedFields = await LoginSchema.validate(values);

    if(!validatedFields) return { error: "Invalid fields!"}

    const { email, password } = validated;
    try{
        await signIn("credentials", email, password, redirect: "/settings")
    }catch(error){
        if(error instanceof AuthError){
            switch
        }
    }
}

declare global{
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new Prisma();
if(process.env.NODE_ENV) {
    globalThis.prisma = db;
}


declare global {
    var prisma = PrismaClient | undefined;
}

export const db = globalThis.prisma || new Prisma;
if(process.env.NODE_ENV){
    globalThis.prisma = db;
}

@@unique([email, token])

user User @relation(fields: [userId], references: [id], onDelete: Cascade )

id string @id @default(cuid()) @map("_id")
npm i -D @types/bcryptjs


export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
    const isPublicRoute = nextUrl.pathname.includes(["/", "auth/new-verification"])
    if(isLoggedIn){
        return Response.redirect(new URL("/settings", nextUrl))
    }
    if(!isLoggedIn && !isPublicRoute){
        return Response.redirect(new URL("/auth/login", nextUrl))
    }
    }
})

const isAuthRoute = nextUrl.pathname.startsWith(authRoute)

*/}