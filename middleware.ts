import NextAuth, { NextAuthResult } from 'next-auth';
import authConfig from '@auth.config';
import { publicRoutes, authRoutes, apiAuthPrefix, DEFAULT_LOGIN_REDIRECT } from '@routes';
import { NextApiResponse } from 'next';

const authHandler = async (req: any, res: NextApiResponse) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  console.log(isLoggedIn);
  console.log('Route: ', req.nextUrl.pathname);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      res.writeHead(302, { Location: new URL(DEFAULT_LOGIN_REDIRECT, nextUrl).toString() });
      res.end();
      return;
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallback = encodeURIComponent(callbackUrl);
    res.writeHead(302, { Location: new URL(`/auth/login?callbackUrl=${encodedCallback}`, nextUrl).toString() });
    res.end();
    return;
  }

  return null;
};

const authResult: NextAuthResult = NextAuth(authConfig);

// Determine the type of authResult.auth to avoid type errors
const authFunction = typeof authResult.auth === 'function' ? authResult.auth : () => {};

export default async function handler(req: any, res: NextApiResponse) {
  if (req.method === 'GET') {
    await authHandler(req, res);
  } else {
    res.status(405).end();
  }
}
