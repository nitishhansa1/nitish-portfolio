import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export default NextAuth(authConfig).auth((req) => {
    const isLoggedIn = !!req.auth
    const isOnAdminPanel = req.nextUrl.pathname.startsWith('/admin')
    const isLoginPage = req.nextUrl.pathname.startsWith('/admin/login')

    if (isOnAdminPanel) {
        if (isLoggedIn && isLoginPage) {
            // Redirect logged in users away from login page to dashboard
            return Response.redirect(new URL('/admin', req.nextUrl))
        }
        if (!isLoggedIn && !isLoginPage) {
            // Redirect unauthenticated users trying to access admin to login page
            return Response.redirect(new URL('/admin/login', req.nextUrl))
        }
    }

    return null
})

// Specify the paths where the middleware should run
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
