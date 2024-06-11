import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// TODO: add here all needed properties, discuss with Artem
// #ask-artem
// TODO: this hook needs mutations, i guess, figure out #react-query
function useGetUser(values: any) {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axios.post("http://localhost:3007/login", values, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }),
  });

  return {
    ...query,
    user: query.data,
  };
}

export default useGetUser;
