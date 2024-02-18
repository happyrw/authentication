import { MdCheckCircle } from 'react-icons/md';

interface FormErrorProps {
    message?: string
}
const FormSuccess = ({ message } : FormErrorProps ) => {
    if(!message) return null;
  return (
    <div className='flex bg-emerald-500/15 p-3 rounded-medium items-center gap-2 text-sm text-emerald-500'>
        <MdCheckCircle className='h-4 w-4' /> <p>{message}</p>
    </div>
  )
}

export default FormSuccess;
