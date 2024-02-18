"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NewPasswordSchema } from '@schemas';
import FormError from '@components/form-error';
import FormSuccess from '@components/form-success';
import { useState, useTransition } from 'react';
import { newPassword } from '@actions/new-password';

const NewPasswordForm = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [ ispending, startTransition ] = useTransition();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const route = useRouter();
    const form = useForm({
        resolver: yupResolver(NewPasswordSchema),
        defaultValues: {
          password: '',
        },
      });
    const { register, handleSubmit, formState: { errors }} = form;

    const onSubmit = (data: any) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            newPassword(data, token)
                .then((response) => {
                    setError(response?.error ?? '');
                    setSuccess(response?.success ?? '');
                });
        });
    };

    return (
        <div className='bg-white px-4 py-4 rounded-lg flex flex-col items-center justify-center w-[400px]'>
            <h1 className='font-semibold rounded-lg text-[20px] capitalize'>Reset Your Password ?</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <input
                    type="password"
                    placeholder='New Password'
                    {...register('password')}
                    disabled={ispending}
                    className='bg-white border-gray-500 rounded-lg w-full px-2 py-[4px] mt-[20px] mb-2'
                />
                {errors.password && <p>{errors.password.message}</p>}
               
                <FormError message={error} />
                <FormSuccess message={success} />
                <button disabled={ispending} type='submit' className='bg-gray-300 text-black rounded-lg px-4 py-2 w-full mt-[20px] mb-[20px]'>Reset Password</button>
            </form>
            <button className='bg-black text-white rounded-lg px-4 p-[5px]' onClick={() => {
                route.push('/auth/login');
            }}>Back to Login</button>
 
        </div>
    );
};

export default NewPasswordForm;
