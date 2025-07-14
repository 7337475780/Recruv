"use client";

import { Providers } from "@/app/providers";
import React from "react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <Providers>{children}</Providers>;
};
