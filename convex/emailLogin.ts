import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Resend } from "resend";
import { customAlphabet } from "nanoid";

const resend = new Resend(process.env.RESEND_API_KEY!);
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 32);

// 1. Request Login
export const requestLogin = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const token = crypto.randomUUID();
    const expires = Date.now() + 1000 * 60 * 60;

    await ctx.db.insert("emailTokens", {
      email: args.email,
      token,
      expires,
    });

    const loginUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${token}`;

    await resend.emails.send({
      from: "onboarding@resend.dev", // Must be verified in Resend
      to: [args.email],
      subject: "Login to Recruv",
      html: `
        <h2>Sign in to Recruv</h2>
        <p>Click <a href="${loginUrl}">here</a> to log in.</p>
        <p>This link expires in 1 hour.</p>
      `,
      text: `Login link: ${loginUrl}`,
    });

    return token;
  },
});

// 2. Verify Token & Create Session
export const verifyLogin = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const tokenDoc = await ctx.db
      .query("emailTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!tokenDoc) {
      console.error("Token not found");
      throw new Error("Invalid or expired token");
    }
    if (!tokenDoc || tokenDoc.expires < Date.now()) {
      console.log("No token found:", args.token);
      throw new Error("Invalid or expired token");
    }

    // Clean up used token
    await ctx.db.delete(tokenDoc._id);

    // Fetch or create user
    let user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", tokenDoc.email))
      .first();

    if (!user) {
      const userId = await ctx.db.insert("users", {
        email: tokenDoc.email,
        name: "",
        role: "candidate",
        token: "",
        createdAt: Date.now(),
      });
      user = await ctx.db.get(userId);
    }

    const sessionToken = nanoid();

    await ctx.db.insert("sessions", {
      userId: user!._id,
      token: sessionToken,
      createdAt: Date.now(),
    });

    return {
      userId: user!._id,
      email: user!.email,
      name: user!.name,
      sessionToken,
    };
  },
});

// 3. Verify Session Token for Credentials Provider
export const getCurrentUser = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) return null;

    const user = await ctx.db.get(session.userId);
    if (!user) return null;

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
    };
  },
});

// 4. Update Profile (Onboarding)
export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      name: args.name,
      role: args.role,
    });
  },
});
