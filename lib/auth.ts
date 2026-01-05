export type SessionUser = {
  id: string;
  tenantId: string;
  email?: string;
  name?: string;
};

export type Session = {
  user: SessionUser;
};

// In a production setup this should call NextAuth's getServerSession.
// For the demo environment we derive a lightweight session from env vars.
export async function getServerSession(): Promise<Session | null> {
  const tenantId = process.env.NEXT_PUBLIC_TENKU_TENANT_CODE;
  if (!tenantId) return null;

  return {
    user: {
      id: process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL ?? "demo-user",
      tenantId,
      email: process.env.NEXT_PUBLIC_TENKU_DEMO_EMAIL,
      name: "TENKU Demo User",
    },
  };
}

export const authOptions = {} as const;
