"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const verifyLogin = useMutation(api.emailLogin.verifyLogin);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const login = async () => {
      try {
        const res = await verifyLogin({ token });
        console.log("Verification res : ", res);
        if (!res) {
          setStatus("error");
          return;
        }

        router.replace("/dashboard");
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };
    login();
  }, [token, verifyLogin, router]);

  if (status === "loading") return <p>Logging you in...</p>;
  if (status === "error") return <p>Invalid or expired login link</p>;
  return null;
};

export default Page;
