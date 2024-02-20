import NextAuth, { type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";
export type ExtendedUser = DefaultSession["user"] & { 
    role: UserRole
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}


{/*
export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}
page: {

},
events: {
    async linkAccount ({ user, }) {
        await db.user.update({ where: {id: user.id }, data: { emailVerified: new Date() }})
    }
},
callbacks: {

},

const searchParams = useSearchParams();
const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email in use with deifferent provider!" : "";
const onClick = (provider: "google" | "github") => {
    signIn(provider);
}

onClick={() => onClick("google")}
onClick={() => onClick("github")}

const form = useForm({
    resolver = yupResolver(LoginSchema),
    defaultValue: {
        email: '', name: ''
    }
})

const { register, handleSubmit, formState: { errors } } = form;
<input
    type="text"
    {...register("name")}
/>

*/}