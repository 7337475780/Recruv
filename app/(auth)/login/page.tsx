"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaGithub, FaGoogle } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const Page = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [magicLink, setMagicLink] = useState("");
  const [loading, setLoading] = useState(false);

  const requestLogin = useMutation(api.emailLogin.requestLogin);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "OAuthAccountNotLinked") {
      setError("This email is already linked with another provider.");
    } else if (err) {
      setError("Authentication failed. Please try again.");
    }
  }, [searchParams]);

  const handleEmailLogin = async () => {
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const token = await requestLogin({ email: email.toLowerCase() });
      const url = `${window.location.origin}/verify?token=${token}`;

      setEmailSent(true);
      setMagicLink(url);
      console.log("Magic Link:", url);
    } catch (err) {
      setError("Failed to send magic link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center dark:bg-black justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-black dark:to-black">
      <div className="bg-white dark:bg-gray-950 p-8 rounded-2xl shadow-xl w-full max-w-sm space-y-6">
        <h1 className="text-2xl dark:text-gray-100 font-bold text-center">
          Sign In
        </h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        {emailSent ? (
          <div className="space-y-3 text-center">
            <p className="text-green-600 dark:text-green-400 text-sm">
              Magic login link sent! Check your email.
            </p>
            {magicLink && (
              <p className="text-xs break-all text-gray-400 dark:text-gray-500">
                Dev-only link: <br />
                <a
                  href={magicLink}
                  className="underline text-blue-500 dark:text-blue-400"
                >
                  {magicLink}
                </a>
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Email Login */}
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="button"
                onClick={handleEmailLogin}
                disabled={loading}
                className="w-full cursor-pointer"
              >
                {loading ? "Sending..." : "Continue with Email"}
              </Button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-muted" />
              <span className="text-sm text-muted-foreground">OR</span>
              <div className="h-px flex-1 bg-muted" />
            </div>

            {/* GitHub Login */}
            <Button
              variant="outline"
              className="w-full gap-2 cursor-pointer"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              <FaGithub className="w-5 h-5" />
              Continue with GitHub
            </Button>

            {/* Google Login */}
            <Button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              variant="outline"
              className="w-full gap-2"
            >
              <FaGoogle className="w-5 h-5" />
              Continue with Google
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
