import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const protectedRoutes = [
  '/admin',
  '/account',
];
const unprotectedRoutes = [ '/auth/login'];

// import { auth } from './services/auth';

export default async function middleware(request: NextRequest) {
   const session = await getToken({ req: request });

  const isProtectedRoute = protectedRoutes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );

  if (!session && isProtectedRoute) {
    const absoluteURL = new URL('/', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  //   if ((request.nextUrl.pathname == "/auth/login" ) && session?.user) {
  //   const homeUrl = new URL("/", request.nextUrl.origin);
  //   // homeUrl.searchParams.append("error", "You are already logedin");
  //   // return NextResponse.redirect(homeUrl.toString());
  //   return NextResponse.redirect(absoluteURL.toString());

  // }
  if (session && unprotectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL('/account', request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}