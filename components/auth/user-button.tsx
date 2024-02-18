"use client";

import { useCurrentUser } from '@hooks/use-current-user';
import React from 'react'
import { FaUser } from 'react-icons/fa';
import { logOut } from '@actions/logout';
import { IoExitSharp } from 'react-icons/io5';

const UserButton = () => {
    const user = useCurrentUser();
    const [dropDown, setDropDown] = React.useState(false);
    const onClick = () => {
        logOut();
    }
  return (
    <main className='relative'>
        <div className="w-[37px] h-[37px] bg-green-500 rounded-full flex items-center justify-center cursor-pointer" onClick={() => setDropDown((prevDropDown) => !prevDropDown)}>
            <div>
                {user?.image ? <img src={user.image} className="w-full h-full rounded-full" /> : <FaUser width={37} height={37} color='white' />}
            </div>
        </div>
        {dropDown && <div className="px-4 py-1 bg-white flex flex-col items-center justify-center absolute -left-9 top-10 rounded-[5px]">
            <p className="text-black font-semibold cursor-pointer flex items-center gap-x-2" onClick={onClick}>Logout<IoExitSharp /></p>
        </div>}
    </main>
  )
}

export default UserButton;