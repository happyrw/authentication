In my middleware (import { NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

// Routes
const publicRoute = "/";
const authRoute = [ "/sign-in", "/sign-up" ];
const apiAuthPrefix = "/api/auth";
const privateRoute = "/onboarding";
const loginRoute = "/sign-in";

const { auth } = NextAuth(authConfig);

export default auth((request: NextRequest) => {
    const nextUrl  = request.nextUrl;
    const isLoggedIn = !!(request as any).auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoute.includes(nextUrl.pathname);
    const isAuthRoute = authRoute.includes(nextUrl.pathname);

    if(isApiAuthRoute) {
        return NextResponse.next()
    }

    if(isAuthRoute) {
        if(isLoggedIn) {
            return NextResponse.redirect(new URL(privateRoute, request.url));
        }
        return NextResponse.next()
    }

    if(!isPublicRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL(loginRoute, request.url))
    }

    return NextResponse.next();
})

export const config = {
   matcher: ['/((?!.+\\w]+$|_next).*)','/', '/(api|trpc)(.*)'] ,
}) when I use publicRoute, the image in here ("use client"
import Image from "next/image";
import { sidebarLinks } from "../../constants/index";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LeftSideBar() {
    const pathName = usePathname();
    const user = false;
    return(
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {sidebarLinks.map((link) => {
                    const isActive = (pathName.includes(link.route) && link.route.length > 1) || pathName === link.route;
                    return (
                    <Link 
                        href={link.route}
                        key={link.label}
                        className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
                    >
                    <Image
                        src={link.imgURL}
                        alt={link.label}
                        width={24}
                        height={24}
                    />
                    <p className="text-light-1 max-lg:hidden">{link.label}</p>
                    </Link>
                )})}
            </div>

            <div className="mt-10 px-6">
            {user && 
                    <div className="flex cursor-pointer gap-4 p-4">
                        <Image
                            src="/assets/logout.svg"
                            alt="logout"
                            width={24}
                            height={24}
                        />
                        <p className="text-light-2 max-lg-hidden">Logout</p>
                    </div>
            }
            </div>
        </section>
    )
}

export default LeftSideBar;) become invisible and the Image comes from (export const sidebarLinks = [
    {
      imgURL: "/assets/home.svg",
      route: "/",
      label: "Home",
    },
    {
      imgURL: "/assets/search.svg",
      route: "/search",
      label: "Search",
    },
    {
      imgURL: "/assets/heart.svg",
      route: "/activity",
      label: "Activity",
    },
    {
      imgURL: "/assets/create.svg",
      route: "/create-thread",
      label: "Create Thread",
    },
    {
      imgURL: "/assets/community.svg",
      route: "/communities",
      label: "Communities",
    },
    {
      imgURL: "/assets/user.svg",
      route: "/profile",
      label: "Profile",
    },
  ];
  
  export const profileTabs = [
    { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
    { value: "replies", label: "Replies", icon: "/assets/members.svg" },
    { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
  ];
  
  export const communityTabs = [
    { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
    { value: "members", label: "Members", icon: "/assets/members.svg" },
    { value: "requests", label: "Requests", icon: "/assets/request.svg" },
  ];). Help me
