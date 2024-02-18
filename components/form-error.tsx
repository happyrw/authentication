import { useEffect, useState } from 'react';
import { MdErrorOutline } from 'react-icons/md';

interface FormErrorProps {
    message?: string
}
const FormError = ({ message } : FormErrorProps ) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if(message) {
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    }
  }, [message])
    if(!message) return null;
  return (
    <>
      {visible && 
        <div className='w-full flex bg-red-500 bg-opacity-15 p-3 rounded-medium items-center gap-2 text-sm text-red-500'>
        <MdErrorOutline className='h-4 w-4' /> <p>{visible && message}</p>
    </div>
      }
    </>
  )
}

export default FormError;