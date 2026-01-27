import { NextResponse } from 'next/server';

export function middleware(req) {
  const jwt = req.cookies.get('jwt');
  const pathname = req.nextUrl.pathname;

  if (
    pathname.startsWith('/student') ||
    pathname.startsWith('/teacher')
  ) {
    if (!jwt) {
      return NextResponse.redirect(
        new URL('/login', req.url)
      );
    }
  }

  return NextResponse.next(); 
}
