"use client";

import { SessionProvider } from "next-auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { PropsWithChildren } from "react";
import StreamClientProvider from "@/components/providers/StreamClientPovider";
import { ThemeProviders } from "@/components/providers/ThemeProviders";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ConvexProvider client={convex}>
        <StreamClientProvider>
          <ThemeProviders
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProviders>
        </StreamClientProvider>
      </ConvexProvider>
    </SessionProvider>
  );
}
