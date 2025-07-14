import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const storeWebhook = mutation({
  args: {
    payload: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("webhookEvents", {
      payload: args.payload,
      receivedAt: Date.now(),
    });
  },
});
