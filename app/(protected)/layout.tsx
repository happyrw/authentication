import Navbar from "./_components/navbar";

interface ProtectedLaoutProps { 
    children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLaoutProps) => {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-sky-500">
        <Navbar />
        {children}
    </div>
  )
}

export default ProtectedLayout;
