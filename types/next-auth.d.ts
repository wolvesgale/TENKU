import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      id?: string;
      tenantId?: string;
      orgId?: string | null;
    };
  }
  interface User {
    tenantId?: string;
    orgId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId?: string;
    orgId?: string | null;
  }
}
