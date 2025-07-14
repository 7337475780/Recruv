"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { StreamClient } from "@stream-io/node-sdk";
import { getServerSession } from "next-auth";

/**
 * Generates a Stream Video user token for the authenticated user.
 * @param userId - The ID of the user requesting the token.
 * @returns JWT token string.
 */
export const streamTokenProvider = async (userId: string): Promise<string> => {
  const session = await getServerSession(authOptions);

  // 🔐 Auth validation
  if (!session || !session.user?.id) {
    throw new Error("Unauthorized: No valid session.");
  }

  if (session.user.id !== userId) {
    throw new Error("Unauthorized: Session user ID mismatch.");
  }

  // ✅ Environment validation
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_SECRET_KEY;

  if (!apiKey || !apiSecret) {
    throw new Error("Missing Stream API credentials.");
  }

  // 🧠 StreamClient setup
  const streamClient = new StreamClient(apiKey, apiSecret);

  // ⚙️ Token payload config (optional: customize claims)
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const token = streamClient.generateUserToken({
    user_id: userId,
    iat: nowInSeconds - 30, // 30-second leeway
  });

  return token;
};
