import authConfig from "./auth.config"
import NextAuth from "next-auth"
import { authAPIRoutes, authRoutes, defaultUrl, publicRoutes } from "./routes";

const { auth } = NextAuth(authConfig)
 
export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const isApiAuthRoute = nextUrl.pathname.startsWith(authAPIRoutes);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  /* console.log("ROUTE: ", nextUrl.pathname);
  console.log("IS LOGGED IN: ", isLoggedIn); */

  if (isApiAuthRoute) {
    return null
  } else if (isPublicRoute) {
    return null;
  } else if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(defaultUrl, nextUrl));
    }
    return null;
  } else if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL(authRoutes[0], nextUrl));
  } else {
    return null;
  }
})
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}