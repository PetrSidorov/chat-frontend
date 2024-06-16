import { AxiosResponse, TUser } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

// TODO: add here all needed properties, discuss with Artem
// #ask-artem
const useGetUser = () => {
  // const queryClient = useQueryClient();
  // const cachedUser = queryClient.getQueryData(["user"]);
  const query = useQuery({
    queryKey: ["user"],
    queryFn: (): Promise<AxiosResponse<TUser>> =>
      axios.get("http://localhost:3007/api/me", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    retry: false,

    // initialData: { data: { data: cachedUser } },
  });

  if (query.isLoading) {
    return { user: null };
  }

  if (query.isError) {
    throw new Error("error fetching user");
  }

  const userData = query.data?.data;
  return {
    ...query,
    user: userData,
  };
};

export default useGetUser;
