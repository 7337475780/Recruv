import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const { email, token } = await req.json();

  const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`;

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // ✅ fallback sender
      to: [email],
      subject: "Login to Recruv",
      html: `
        <div style="font-family: sans-serif;">
          <h2>Sign in to Recruv</h2>
          <a href="${loginUrl}" style="color:#4f46e5">Login</a>
          <p style="font-size: 12px; color: gray;">Link expires in 1 hour</p>
        </div>`,
      text: `Login link: ${loginUrl}`,
    });

    if (result.error) {
      return new NextResponse("Email failed", { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return new NextResponse("Email send failed", { status: 500 });
  }
}
