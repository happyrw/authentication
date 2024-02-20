"use client";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoginSchema } from '@schemas';
import FormError from '@components/form-error';
import FormSuccess from '@components/form-success';
import { login } from '@actions/login';
import { useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SocialButtons from './social-button';

const LoginForm = () => {

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl');
    const urlError = searchParams.get('error') === "OAuthAccountNotLinked" ? "Email already in use with different provider !" : "";
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>(''); 

    const route = useRouter();
    const form = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues: {
          email: '',
          password: '',
        },
      });
    const { register, handleSubmit, formState: { errors }} = form;

    const onSubmit = (data: any) => {
        setError('');
        setSuccess('');

        startTransition(() => {
            login(data, callbackUrl)
                .then((data) => {
                    // const LoginData = data as { error?: string; success?: string; };
                    if(data?.error) {
                        // form.reset();
                        setError(data?.error);
                    }

                    if(data?.success) {
                        form.reset();
                        setError(data?.success);
                    }
                    if(data?.twoFactor) {
                        setShowTwoFactor(true)
                    }
                })
                .catch(() => setError("Something went wrong!"));
        });
    };

return (
        <div className='bg-white px-4 py-4 rounded-lg flex flex-col items-center justify-center w-[400px]'>
            <h1 className='font-semibold rounded-lg text-[40px] capitalize'>Login form</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                {showTwoFactor && (
                    <input
                    type="text"
                    placeholder='Enter Your 2FA Code'
                    {...register('code')}
                    disabled={isPending}
                    className='bg-white border-gray-500 rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
                />
                )}
                {!showTwoFactor && (<>
                <input
                    type="text"
                    placeholder='Email'
                    {...register('email')}
                    disabled={isPending}
                    className='bg-white border-gray-500 rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
                />
                {errors.email && <p>{errors.email.message}</p>}
                <input
                    type="password"
                    placeholder='Password'
                    {...register('password')}
                    disabled={isPending}
                    className='bg-white border-gray-500 rounded-lg w-full px-2 py-[4px] mt-2 mb-2'
                />
                <Link href="/auth/reset" className='block mb-[10px] text-[13px] float-right'>
                    <button>Forget Password?</button>
                </Link>
                {errors.password && <p>{errors.password.message}</p>}
                 </>)}
                <FormError message={error || urlError}/>
                <FormSuccess message={success} />
                <button disabled={isPending} type='submit' className='bg-gray-300 text-black rounded-lg px-4 py-2'>{showTwoFactor ? "Confirm" : "Sign In"}</button>
            </form>
            {!showTwoFactor && <><span>Do not have an account? <button className='bg-black text-white rounded-lg px-4 p-[5px]' onClick={() => {
                route.push('/auth/register');
            }}>Sign Up</button></span>
            <SocialButtons />
            </>}
        </div>
    );
};

export default LoginForm;
