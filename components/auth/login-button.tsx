"use client"

import { useRouter } from "next/navigation";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: "model" | "redirect";
    asChild?: boolean;
};

export const LoginButton = ({ children, mode = "redirect", asChild } : LoginButtonProps ) => {
   const route = useRouter();

   const navigate = () => {
    route.push('/auth/login')
   }

    return(
        <span onClick={navigate}>
            {children}
        </span>
    )
}