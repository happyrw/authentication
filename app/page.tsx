import { FaLock } from 'react-icons/fa';
import { LoginButton } from "@components/auth/login-button";

const Home = () => {
  return (
    <div className="h-full bg-blue-800 flex flex-col items-center justify-center">
      <h1 className="px-5 py-2 bg-white text-black font-semibold rounded-lg text-[40px] flex items-center justify-center gap-3"><FaLock />Auth Tutorial</h1>
      <p className="text-white capitalize font-semibold mt-4">Sign In with the below button</p>
      <LoginButton>
        <button className='bg-black px-4 py-2 text-white rounded-lg m-2 mt-4 font-semibold active:bg-gray-500'>Sign In</button>
      </LoginButton>
    </div>
  );
};

export default Home;
