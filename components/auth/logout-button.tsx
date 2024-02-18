"use client"

import { logOut } from "@actions/logout";

interface LoginButtonProps {
    children: React.ReactNode;
};

export const LogoutButton = ({ children } : LoginButtonProps ) => {

   const onClick = () => {
        logOut();
   }

    return(
        <span onClick={onClick} className="cursor-pointer">
            {children}
        </span>
    )
}