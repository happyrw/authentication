"use client";
import { RoleGate } from '@components/auth/role-gate';
import FormSuccess from '@components/form-success';
// import { useCurrentRole } from '@hooks/use-current-user';
import { toast } from 'react-toastify';
import { UserRole } from '@prisma/client';
import React from 'react'
import { admin } from '@actions/admin';

const AdminPage = () => {
  const onServerActionClick = () => {
    admin()
      .then((data) => {
        if(data.error){
          toast.error(data.error)
        }

        if(data.success){
          toast.success(data.success)
        }
      })
  }
    const onApiRouteClick = () => {
      fetch("api/admin")
        .then((response) => {
          if(response.ok){
            toast("Allowed API Route", { type: 'success' });
          }else{
            toast.error("Forbiden API Route")
          }
        })
    }
  return (
    <main className='w-[600px] bg-white px-4 py-2 flex flex-col'>
      <p className='flex items-center justify-center'>ADMIN</p>
      <div className='space-y-4'>
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message='You are allowed to see this contents!' />
        </RoleGate>
        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p>Admin only API routes</p>
          <button className='bg-black text-white px-4 py-2 rounded-lg' onClick={onApiRouteClick}>Click to test</button>
        </div>
        <div className='flex flex-row items-center justify-between rounded-lg border p-3 shadow-md'>
          <p>Admin only Server action</p>
          <button className='bg-black text-white px-4 py-2 rounded-lg' onClick={onServerActionClick}>Click to test</button>
        </div>
      </div>
    </main>
  )
}

export default AdminPage;
