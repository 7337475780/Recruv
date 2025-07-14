import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token) {
    return new NextResponse("Missing token", { status: 400 });
  }

  try {
    const user = await fetchQuery(api.emailLogin.getCurrentUser, { token });

    if (!user) {
      return new NextResponse("Invalid or expired token", { status: 401 });
    }

    return NextResponse.json({
      _id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.error("Verify session error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
