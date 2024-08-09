import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { CustomUser } from "./app/api/auth/[...nextauth]/options";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = await getToken({ req: request });

  if ((pathname == "/login" || pathname == "/register") && token?.user) {
    const homeUrl = new URL("/", request.nextUrl.origin);
    homeUrl.searchParams.append("error", "You are already logedin");
    return NextResponse.redirect(homeUrl.toString());
  }

  // * Protected route for user
  const userProtectedRoutes = ["/checkout"];

  // * Protected route for user
  const userRoutes = ["/login", "/register"];

  // * Protected routes for admin
  const adminProtectedRoutes = [
    "/admin",
    "/admin/comments",
    "/admin/all-products/add-product",
    "/admin/all-products",
    "/admin/returns",
    "/admin/manage-order",
    "/admin/category",
    "/admin/customize",
    "/admin/blogs",
    "/admin/blogs/blog-post",
    "/admin/blogs/blog-category",
    "/admin/login-users",
    "/admin/megamenu",
    "/admin/payments",
    "/admin/subscribers",
    "/admin/wishlists",
    "/admin/cancelled-order",
  ];

  // user not login any role
  if (
    token == null &&
    (userProtectedRoutes.includes(pathname) ||
      adminProtectedRoutes.includes(pathname))
  ) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    loginUrl.searchParams.append(
      "error",
      "Please login first to access this page"
    );

    return NextResponse.redirect(loginUrl.toString());
  }

  // * Get user from token
  const user: CustomUser | null = token?.user as CustomUser;

  // * if user try to access admin routes
  if (adminProtectedRoutes.includes(pathname) && user.role == "user") {
    const loginUrl = new URL("/", request.nextUrl.origin);
    loginUrl.searchParams.append(
      "error",
      "You are not eligible for access this page"
    );

    return NextResponse.redirect(loginUrl.toString());
  }

  // * If User role is undefined
  if (adminProtectedRoutes.includes(pathname) && user.role == null) {
    const loginUrl = new URL("/", request.nextUrl.origin);
    loginUrl.searchParams.append(
      "error",
      "Your role is undefined so you are not access this page"
    );

    return NextResponse.redirect(loginUrl.toString());
  }
  // * null

  // * if user are logedin then is not access login page or register page

  // * End
}
