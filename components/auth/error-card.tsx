"use client"
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaLock } from 'react-icons/fa';

const ErrorCard = () => {
    const route = useRouter();
    const backToLogin = () => {
        route.push("/auth/login");
    }
    return (
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="px-5 py-2 bg-white text-black font-semibold rounded-lg text-[40px] flex items-center justify-center gap-3"><FaLock />Auth Error</h1>
          <p className="text-white capitalize font-semibold mt-4">Ooops! Something went wrong!</p>
        <button className='bg-black px-4 py-2 text-white rounded-lg m-2 mt-4 font-semibold active:bg-gray-500' onClick={backToLogin}>Back to login</button>
        </div>
      );
}

export default ErrorCard;
