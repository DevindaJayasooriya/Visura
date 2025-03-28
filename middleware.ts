import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {

  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard')
   
   // If it's the dashboard route and no user is signed in, redirect to sign-in
   if (isDashboardRoute) {
     const authObject = await auth();
     if (!authObject.userId) {
       return NextResponse.redirect(new URL('/sign-in', req.url))
     }
   }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}