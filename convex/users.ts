import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create user manually (e.g., after verifying magic link)
export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) return existingUser;

    return await ctx.db.insert("users", {
      ...args,
      createdAt: Date.now(),
      token: "",
    });
  },
});

// Get currently authenticated user (from NextAuth session)
export const getUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity(); // optional for Convex Auth
    if (!identity) throw new Error("User is not authenticated");

    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// Get user by email (used in login / profile)
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return user;
  },
});

export const updateUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    role: v.optional(v.union(v.literal("candidate"), v.literal("interviewer"))),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      ...(args.name && { name: args.name }),
      ...(args.role && { role: args.role }),
      ...(args.image && { image: args.image }),
    });

    return { success: true };
  },
});
