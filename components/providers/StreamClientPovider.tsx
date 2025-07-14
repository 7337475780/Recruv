"use client";

import { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import LoaderUI from "../LoaderUI";
import { streamTokenProvider } from "@/actions/stream.actions";

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [streamVideoClient, setStreamVideoClient] =
    useState<StreamVideoClient | null>(null);

  useEffect(() => {
    // Only proceed when authenticated and session is available
    if (status !== "authenticated" || !session?.user?.id) return;

    const setupClient = async () => {
      const token = await streamTokenProvider(session.user.id);

      const client = new StreamVideoClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      });

      await client.connectUser(
        {
          id: session.user.id,
          name: session.user.name || session.user.email || session.user.id,
          image: session.user.image || undefined,
        },
        token
      );

      setStreamVideoClient(client);
    };

    setupClient();

    return () => {
      streamVideoClient?.disconnectUser();
    };
  }, [status, session]);

  if (status === "loading") return <LoaderUI />;

  if (status !== "authenticated" || !session?.user?.id) {
    // Unauthenticated users: do NOT load StreamVideo client — just render children
    return <>{children}</>;
  }

  if (!streamVideoClient) return <LoaderUI />;

  return <StreamVideo client={streamVideoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
