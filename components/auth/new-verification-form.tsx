"use client"
import { newVerification } from '@actions/new-verification';
import FormError from '@components/form-error';
import FormSuccess from '@components/form-success';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'
import { FaLock } from 'react-icons/fa';
import { BeatLoader } from 'react-spinners';

const NewVerificationForm = () => {

    const serachParams = useSearchParams();
    const token = serachParams.get("token");
    const [error, setError ] = useState<string | undefined>('')
    const [success, setSuccess ] = useState<string | undefined>('')
    const route = useRouter();

    const backToLogin = () => {
        route.push("/auth/login")
    }
    const onSubmit = useCallback(() => {
        if(!token) {
            setError("Missing token !");
            return;
        }
        newVerification(token)
            .then((data) => {
                setError(data?.error);
                setSuccess(data?.seccess);
            })
            .catch(() => setError("Something went wrong!"))
    }, [token])

    useEffect(() => {
        onSubmit();
    }, [onSubmit])
    return (
        <div className="h-full flex flex-col items-center justify-center">
          <h1 className="px-5 py-2 bg-white text-black font-semibold rounded-lg text-[40px] flex items-center justify-center gap-3"><FaLock />Auth Confirmation</h1>
          <p className="text-white capitalize font-semibold mt-4">Confirm your Email !</p>
          { !success && !error && (
              <BeatLoader color="#fff" loading={true} size={15} className='mt-2' />
          )}
          <FormError message={error} />
          <FormSuccess message={success} />
        <button className='bg-black px-4 py-2 text-white rounded-lg m-2 mt-4 font-semibold active:bg-gray-500' onClick={backToLogin}>Back to login</button>
        </div>
      );
}

export default NewVerificationForm;
