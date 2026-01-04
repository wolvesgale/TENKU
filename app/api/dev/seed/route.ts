import { NextResponse } from "next/server";
import { runSeed, seedPrisma } from "@/prisma/seed";

export async function POST(req: Request) {
  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "disabled in production" }, { status: 403 });
  }

  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  const body = await req.json().catch(() => ({}));
  const payloadSecret = body?.secret as string | undefined;

  const seedSecret = process.env.SEED_SECRET;
  if (!seedSecret || (secret !== seedSecret && payloadSecret !== seedSecret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    await runSeed();
    await seedPrisma.$disconnect();
    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error(error);
    await seedPrisma.$disconnect();
    return NextResponse.json({ error: "seed_failed", detail: String(error?.message ?? error) }, { status: 500 });
  }
}
