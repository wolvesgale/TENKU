import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id?: string;
      tenantId?: string;
      orgId?: string;
    };
  }

  interface User {
    tenantId?: string;
    orgId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId?: string;
    orgId?: string;
  }
}
