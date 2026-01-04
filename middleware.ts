import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret",
});

export const config = {
  matcher: ["/((?!api/auth|api/mock|api/dev/seed|_next/static|_next/image|favicon.ico|login).*)"],
};
