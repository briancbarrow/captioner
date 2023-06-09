import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });
  const session = await supabase.auth.getSession();
  console.log("HERE I AM");
  if (session.data.session === null) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (req.nextUrl.pathname === "/admin") {
    const authDomain = session.data.session.user.email?.split("@")[1];
    if (authDomain !== "deepgram.com") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/app/:path*",
    "/events/:path*/broadcast",
    "/events/",
    "/admin/:path*",
  ],
};
