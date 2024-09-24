import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getServerSession } from "next-auth";
// import { getSession } from "next-auth/react";
// import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
// import { getSession } from "./_hooks/getSession";

const protectedRoutes = ["/admin", "/account"];
const unprotectedRoutes = ["/auth"];

// import { auth } from './services/auth';

export default async function middleware(request: NextRequest) {
  // const req = {
  //   headers: new Headers(request.headers),
  //   method: request.method,
  //   url: request.url,
  //   cookies: request.cookies,
  // };

  const session: any = await getToken({req:request});

  // console.log(session);
  const isProtectedRoute = protectedRoutes.some((prefix) =>
    request.nextUrl.pathname.startsWith(prefix)
  );
  const refererHeader = request.headers.get("referer");
  const isComingFromAuthLogin =
    refererHeader && refererHeader.includes("/auth/login");

  if (!session && isProtectedRoute && !isComingFromAuthLogin) {
    // console.log(request);
    const absoluteURL = new URL("/auth/login", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (session && unprotectedRoutes.includes(request.nextUrl.pathname)) {
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
  if (session?.user.role !== "/admin" && unprotectedRoutes.includes("/admin")) {
    const absoluteURL = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}
