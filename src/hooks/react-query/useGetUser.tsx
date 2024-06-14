import { TUser } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo } from "react";

// TODO: add here all needed properties, discuss with Artem
// #ask-artem
function useGetUser(initialData?: TUser) {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: (): Promise<TUser> =>
      axios.get("http://localhost:3007/api/me", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    retry: false,
    initialData,
  });

  return useMemo(() => {
    return {
      ...query,
      user: query.data,
    };
  }, [query.data]);
}

export default useGetUser;
