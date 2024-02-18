import { ExtendedUser } from '@next-auth';
import React from 'react';

interface UserInfoProps {
  user?: ExtendedUser,
  side: string
}

const UserInfos = ({ user, side } : UserInfoProps ) => {
  return (
    <main className='flex flex-col items-center bg-white w-[600px] p-4 rounded-lg'>
      <p className='font-bold text-[17px]'>{side} component</p>
      <div className='w-full flex items-center justify-between mb-[20px]'>
        <p className='text-sm font-medium'>ID</p>
        <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>{user?.id}</p>
      </div>
      <div className='w-full flex items-center justify-between mb-[20px]'>
        <p className='text-sm font-medium'>Name</p>
        <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>{user?.name}</p>
      </div>
      <div className='w-full flex items-center justify-between mb-[20px]'>
        <p className='text-sm font-medium'>Email</p>
        <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>{user?.email}</p>
      </div>
      <div className='w-full flex items-center justify-between mb-[20px]'>
        <p className='text-sm font-medium'>Role</p>
        <p className='truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md'>{user?.role}</p>
      </div>
      <div className='w-full flex items-center justify-between mb-[20px]'>
        <p className='text-sm font-medium'>Two Factor Authentication</p>
        <p className={user?.isTwoFactorEnabled ? "success" : "destructive"}>{user?.isTwoFactorEnabled ? "ON" : "OFF" }</p>
      </div>
    </main>
  )
}

export default UserInfos;
