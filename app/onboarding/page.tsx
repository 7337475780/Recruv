"use client";

import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // ✅ App Router
import { useState } from "react";

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateUser); // ✅ Assuming you renamed it from `emailLogin.updateProfile`

  const [name, setName] = useState("");
  const [role, setRole] = useState<"candidate" | "interviewer">("candidate");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user?.email) return;

    setLoading(true);

    try {
      await updateProfile({
        email: session.user.email,
        name,
        role,
        image: session.user.image ?? "",
      });

      router.push("/");
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Welcome to Recruv
        </h1>

        <input
          type="text"
          className="border w-full p-2 rounded dark:bg-gray-800 dark:text-white"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border w-full p-2 rounded dark:bg-gray-800 dark:text-white"
          value={role}
          onChange={(e) =>
            setRole(e.target.value as "candidate" | "interviewer")
          }
        >
          <option value="candidate">Candidate</option>
          <option value="interviewer">Interviewer</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition-colors"
          disabled={loading}
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
