import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const useGetcallById = (id: string) => {
  const [call, setCall] = useState<Call | null>(null);
  const [isCallLoading, setIsCallLoading] = useState(true);
  const client = useStreamVideoClient();

  useEffect(() => {
    if (!client) return;

    const getCall = async () => {
      try {
        const { calls } = await client.queryCalls({
          filter_conditions: { id },
        });

        setCall(calls.length > 0 ? calls[0] : null);
      } catch (err) {
        console.error("Error fetching call:", err);
        setCall(null);
      } finally {
        setIsCallLoading(false);
      }
    };

    getCall();
  }, [client, id]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!client) {
        console.warn("Stream client unavailable after 10s.");
        setIsCallLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [client]);

  return { call, isCallLoading };
};

export default useGetcallById;
