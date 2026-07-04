import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16: "middleware" is renamed to "proxy"
export function proxy(request: NextRequest) {
  // Route protection will be handled via Supabase session checks
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
