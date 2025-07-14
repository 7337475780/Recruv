import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useSession } from "next-auth/react";

export const useUserRole = () => {
  const { data: session } = useSession();

  const userId = session?.user?.email || "";

  const userData = useQuery(api.users.getUserByEmail, {
    email: userId,
  });

  const isLoading = userData === undefined;

  return {
    isLoading,
    isInterviewer: userData?.role === "interviewer",
    isCandidate: userData?.role === "candidate",
  };
};
