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
    // #ask-artem if i remove stale Time infinity, i get infinite rerenders
    staleTime: Infinity,
    queryFn: (): Promise<AxiosResponse<TUser>> => {
      return axios.get("http://localhost:3007/api/me", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
    },

    retry: false,

    // initialData: { data: { data: cachedUser } },
  });

  return useMemo(() => {
    if (query.isLoading || query.isError) {
      return {
        ...query,
        user: null,
      };
    }

    const userData = query.data?.data;
    return {
      ...query,
      user: userData,
    };
  }, [query]);
};

export default useGetUser;
