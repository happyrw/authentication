"use client";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { RegisterSchema } from '@schemas';
import FormError from '@components/form-error';
import FormSuccess from '@components/form-success';
import { useState, useTransition } from 'react';
import { registration } from '@actions/register';
import SocialButtons from './social-button';

const RegisterForm = () => {

    const [ ispending, startTransition ] = useTransition();
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('');

    const route = useRouter();
    const form = useForm({
        resolver: yupResolver(RegisterSchema),
        defaultValues: {
          name:'',
          email: '',
          password: '',
        },
      });
    const { register, handleSubmit, formState: { errors }} = form;
    const onSubmit = (data: any) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            registration(data)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                });
        });
    };
  
    return (
        <div className='bg-white px-4 py-4 rounded-lg flex flex-col items-center justify-center w-[400px]'>
            <h1 className='font-semibold rounded-lg text-[40px] capitalize'>Registration form</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    placeholder='Name'
                    {...register('name')}
                    disabled={ispending}
                    className='bg-white border-gray-500 rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
                />
                {errors.name && <p>{errors.name.message}</p>}
                <input
                    type="text"
                    placeholder='Email'
                    {...register('email')}
                    disabled={ispending}
                    className='bg-white border-gray-500 rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
                />
                {errors.email && <p>{errors.email.message}</p>}
                <input
                    type="password"
                    placeholder='Password'
                    {...register('password')}
                    disabled={ispending}
                    className='bg-white border-gray-500 rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
                />
                {errors.password && <p>{errors.password.message}</p>}
                <FormError message={error}/>
                <FormSuccess message={success} />
                <button disabled={ispending} type='submit' className='bg-gray-300 text-black rounded-lg px-4 py-2'>Sign Up</button>
            </form>
            <span>Already have an account? <button className='bg-black text-white rounded-lg px-4 p-[5px]' onClick={() => {
                route.push('/auth/login');
            }}>Sign In</button></span>
            <SocialButtons />
        </div>
    );
};

export default RegisterForm;