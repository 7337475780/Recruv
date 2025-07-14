import { NextResponse, NextRequest } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const payload = JSON.parse(raw);

    await fetchMutation(api.webhooks.storeWebhook, { payload });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook handler err : ", err);
    return new NextResponse("Invalid webhook ", { status: 400 });
  }
}
