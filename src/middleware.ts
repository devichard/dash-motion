import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const adminRoutes = ["/admin"];
const sellerRoutes = ["/seller"];
const publicRoutes = ["/auth/*", "/checkout/*"];

function decodeJWT(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    const decoded = JSON.parse(jsonPayload);

    if (decoded.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTime) {
        return { expired: true };
      }
    }

    // No middleware, precisamos pegar approved do JWT ou do user dentro do JWT
    // Se não existir, assumimos false por segurança
    if (decoded.user) {
      return {
        role: decoded.user.role,
        approved: decoded.user.approved ?? false,
        expired: false,
      };
    }

    return {
      role: decoded.role,
      approved: decoded.approved ?? false,
      expired: false,
    };
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isSellerRoute = sellerRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  const isProtectedRoute = isAdminRoute || isSellerRoute;

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (token) {
    const decoded = decodeJWT(token);

    if (!decoded || decoded.expired) {
      const response = NextResponse.redirect(new URL("/auth/signin?expired=true", request.url));

      response.cookies.delete("token");
      return response;
    }

    const userRole = decoded?.role;
    const userApproved = decoded?.approved;

    if (isPublicRoute) {
      if (userRole === "admin") {
        return NextResponse.redirect(new URL("/admin/overview", request.url));
      }
      if (userRole === "seller") {
        // Redireciona para overview se aprovado, enterprise se não
        const redirectUrl = userApproved ? "/seller/overview" : "/seller/onboarding";
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }

    if (isAdminRoute && userRole !== "admin") {
      const redirectUrl = userApproved ? "/seller/overview" : "/seller/enterprise";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    if (isSellerRoute && userRole !== "seller") {
      return NextResponse.redirect(new URL("/admin/overview", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$|.*\\.gif$).*)"],
};
