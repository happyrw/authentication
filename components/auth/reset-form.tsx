"use client";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ResetSchema } from '@schemas';
import FormError from '@components/form-error';
import FormSuccess from '@components/form-success';
import { login } from '@actions/login';
import { useState, useTransition } from 'react';
import { reset } from '@actions/reset';

const ResetForm = () => {

    const [ ispending, startTransition ] = useTransition();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const route = useRouter();
    const form = useForm({
        resolver: yupResolver(ResetSchema),
        defaultValues: {
          email: '',
        },
      });
    const { register, handleSubmit, formState: { errors }} = form;

    const onSubmit = (data: any) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            reset(data)
                .then((data) => {
                    const LoginData = data as { error?: string; success?: string; };
                    setError(LoginData.error || '');
                    setSuccess(LoginData.success || '');
                });
        });
    };

    return (
        <div className='bg-white px-4 py-4 rounded-lg flex flex-col items-center justify-center w-[400px]'>
            <h1 className='font-semibold rounded-lg text-[20px] capitalize'>Forgot Your Password ?</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
                <input
                    type="text"
                    placeholder='Email'
                    {...register('email')}
                    disabled={ispending}
                    className='bg-white border-gray-500 rounded-lg w-full px-2 py-[4px] mt-[20px] mb-2'
                />
                {errors.email && <p>{errors.email.message}</p>}
               
                <FormError message={error} />
                <FormSuccess message={success} />
                <button disabled={ispending} type='submit' className='bg-gray-300 text-black rounded-lg px-4 py-2 w-full mt-[20px] mb-[20px]'>Send reset email</button>
            </form>
            <button className='bg-black text-white rounded-lg px-4 p-[5px]' onClick={() => {
                route.push('/auth/login');
            }}>Back to Login</button>
 
        </div>
    );
};

export default ResetForm;
