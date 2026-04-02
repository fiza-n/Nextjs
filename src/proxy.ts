import { NextRequest,NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"
 
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    const token = await getToken({req:request})
    const url  = request.nextUrl

    // if logged in, don't let them visit auth pages
    if(token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify')
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // if NOT logged in, don't let them visit protected pages
    if(!token && (
        url.pathname.startsWith('/dashboard')
    )) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // everyone else — let them through!
    return NextResponse.next()
}
 
 
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up',
    '/dashboard/:path*',
    '/verify/:path*',
    '/'
]
}