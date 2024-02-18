"use client";
import UserButton from '@components/auth/user-button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'

const Navbar = () => {
    const pathName = usePathname();
  return (
    <nav className='flex items-center justify-between p-4 bg-gray-100 w-[600px] rounded-lg'>
      <div className='flex gap-x-2'>
        <button
          className={pathName === '/server' ? 'bg-black px-4 py-2 text-white rounded-lg' : 'bg-white px-4 py-2'}
        >
            <Link href='/server'>
                Server
            </Link>
        </button>
        <button
          className={pathName === '/client' ? 'bg-black px-4 py-2 text-white rounded-lg' : 'bg-white px-4 py-2'}
        >
            <Link href='/client'>
                Client
            </Link>
        </button>
        <button
          className={pathName === '/admin' ? 'bg-black px-4 py-2 text-white rounded-lg' : 'bg-white px-4 py-2'}
        >
            <Link href='/admin'>
                Admin
            </Link>
        </button>
        <button
          className={pathName === '/settings' ? 'bg-black px-4 py-2 text-white rounded-lg' : 'bg-white px-4 py-2 rounded-lg'}
        >
            <Link href='/settings'>
                Settings
            </Link>
        </button>
      </div>
      <UserButton />
    </nav>
  )
}

export default Navbar;
