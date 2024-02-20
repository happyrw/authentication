"use client";
import { settings } from "@actions/settings";
import FormError from "@components/form-error";
import FormSuccess from "@components/form-success";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCurrentUser } from "@hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { settingSchema } from "@schemas";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CiSettings } from "react-icons/ci";
import { ValidationError } from "yup";


const SettingPage = () => {
  const user = useCurrentUser();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isToggled, setIsToggled] = useState(user?.isTwoFactorEnabled);

  const form = useForm({
    resolver: yupResolver(settingSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || undefined,
      email: user?.email || undefined,
      role: user?.role || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });
  const { register, handleSubmit, formState: { errors } } = form;
  const onSubmit = (values: any) =>{
    try {
      values.isTwoFactorEnabled = isToggled;
      startTransition(() =>{
        settings(values)
          .then((data) => {
            if(data?.error) {
              console.log("Error")
              setError(data.error);
            }
            if(data?.success) {
              console.log("Success")
              update();
              setSuccess(data.success);
            }
          })
          .catch((error) => {
            console.error("An error occurred during form submission:", error);

            if (error instanceof ValidationError) {
              const customError = error.errors.find((err) => err.includes("password-or-newPassword"));
              if (customError) {
                console.log("Error found")
                setError(customError);
              } else {
                console.log("Error not found")
                setError("Something went wrong!");
              }
            } else {
              console.log("No error found")
              setError("Something went wrong!");
            }
          });
      })
    } catch (error) {
      console.log(error)
    }
  }

  
const handleToggle = () => {
  setIsToggled((isToggled) => !isToggled);
};

useEffect(() => {
  setIsToggled(user?.isTwoFactorEnabled || false);
}, [user]);

  return (
    <main className="w-[600px] bg-white p-4">
      <p className="flex items-center justify-center w-full gap-[10px] font-bold text-[17px]"><CiSettings className="text-2xl" /> Settings</p>
      <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mt-[10px]">
            <p className="ml-[7px] font-bold">Name</p>
            <input
              type="text"
              {...register('name')}
              disabled={isPending}
              className='bg-white text-gray-400 shadow-sm rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
            />
          </div>
          {user?.isOAuth === false && (<>
          <div className="flex flex-col mt-[10px]">
            <p className="ml-[7px] font-bold">Email</p>
            <input
              type="email"
              {...register('email')}
              disabled={isPending}
              className='bg-white text-gray-400 shadow-sm rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
            />
          </div>
          <div className="flex flex-col mt-[10px]">
            <p className="ml-[7px] font-bold">Password</p>
            <input
              type="password"
              placeholder="old password"
              {...register('password')}
              disabled={isPending}
              className='bg-white text-gray-400 shadow-sm rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
            />
            {errors.password && <FormError message={errors.password.message} />}
          </div>
          <div className="flex flex-col mt-[10px]">
            <p className="ml-[7px] font-bold">New Password</p>
            <input
              type="password"
              placeholder="new password"
              {...register('newPassword')}
              disabled={isPending}
              className='bg-white text-gray-400 shadow-sm rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
            />
            {errors.password && <FormError message={errors.password.message} />}
          </div>
          </>)}
          <div className="flex flex-col mt-[10px]">
            <p className="ml-[7px] font-bold">User Role</p>
            <select className="ml-[7px] text-gray-400" {...register("role")}>
              <option value={user?.role}>{user?.role}</option>
              {user?.role === "USER" ? <option value={UserRole.ADMIN}>ADMIN</option> : <option value={UserRole.USER}>USER</option>}
            </select>
          </div>
          {user?.isOAuth === false && (
          <div className="mt-[10px]">
            <p className="ml-[7px] font-bold">Two Factor Authentication</p>
            <div className="flex items-center justify-between">
              <p className="ml-[7px] text-gray-400">Enable Two Factor Authentication for your account</p>
              <div className={isToggled ? "w-[50px]  bg-green-800 rounded-[30px] p-[2px]" : "w-[50px] bg-black rounded-[30px] p-[2px]"}>
                <div onClick={handleToggle} className={isToggled ? "w-[20px] h-[20px] bg-white rounded-full float-end cursor-pointer" : "w-[20px] h-[20px] bg-white rounded-full cursor-pointer"}></div>
              </div>
            </div>
          </div>
          )}
          <FormError message={error} />
          <FormSuccess message={success} />
        <button disabled={isPending} type='submit' className='bg-black text-white rounded-lg px-4 py-2 cursor-pointer mt-[10px]'>Save</button>
      </form>
    </main>
  )
}

export default SettingPage;
