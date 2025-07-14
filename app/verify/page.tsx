"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";

const VerifyPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const verifyToken = useMutation(api.emailLogin.verifyLogin); // Convex login

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError("Invalid or missing token.");
        return;
      }

      try {
        // 1. Verify with Convex and get session token
        const result = await verifyToken({ token });

        const sessionToken = result.sessionToken;

        // 2. Sign in with NextAuth using session token
        const nextAuthResult = await signIn("credentials", {
          token: sessionToken, // ✅ Correct token here
          redirect: false,
        });

        if (nextAuthResult?.ok) {
          setSuccess(true);
          setTimeout(() => router.push("/"), 2000);
        } else {
          setError("Failed to sign in.");
        }
      } catch (err) {
        console.error(err);
        setError("Login failed or token expired.");
      }
    };

    verify();
  }, [token, verifyToken, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-6 bg-white rounded-2xl shadow-md max-w-sm w-full">
        {error ? (
          <div className="text-red-600 font-medium">{error}</div>
        ) : success ? (
          <div className="text-green-600 font-medium">Login successful!</div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin w-6 h-6 text-blue-500" />
            <p className="text-gray-600">Verifying token...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
