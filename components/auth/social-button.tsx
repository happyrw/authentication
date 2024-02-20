"use client";
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';

const SocialButtons = () => {
    const socialLogin = async (provider: 'google' | 'github') => {
        await signIn(provider)
    }

  return (
    <div className='flex mt-4 w-full gap-4'>
        <button className='bg-gray-300 rounded-lg px-4 py-2 w-[100%] flex items-center justify-center' onClick={() => socialLogin("google")}><FcGoogle size={20} /></button>
        <button className='bg-gray-300 rounded-lg px-4 py-2 w-[100%] flex items-center justify-center' onClick={() => socialLogin("github")}><FaGithub size={20} /></button>
    </div>
  )
}

export default SocialButtons;
