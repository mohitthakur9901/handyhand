import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, authApi } from "../utils/api";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

export const useSyncUser = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();
  console.log("api", api.defaults.baseURL);
  console.log("isSignedIn", isSignedIn);

  const SynUserMutation = useMutation({
    mutationFn: () => authApi.syncUser(api),

    onSuccess: (response: any) => {
      console.log("User synced successfully" , response);
    },
    onError: (error: any) => {
      console.error("Error syncing user:", error);
    },
  });

  useEffect(() => {
    if (isSignedIn && !SynUserMutation.data) {
      SynUserMutation.mutate();
    }
  }, [isSignedIn]);
  return null;
};
