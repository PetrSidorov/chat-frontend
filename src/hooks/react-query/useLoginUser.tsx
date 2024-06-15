// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// // TODO: add here all needed properties, discuss with Artem
// // #ask-artem
// // TODO: this hook needs mutations, i guess, figure out #react-query
// function useGetUser(values: any) {
//   const query = useQuery({
//     queryKey: ["user"],
//     queryFn: () =>
//       axios.post("http://localhost:3007/login", values, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }),
//   });

//   return {
//     ...query,
//     user: query.data,
//   };
// }

// export default useGetUser;
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
// TODO: all validation stuff should be passed here,
// because it's duplicated in register page

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2),
});

type LoginFormValues = z.infer<typeof formSchema>;

const loginUser = async (values: LoginFormValues) => {
  const response = await axios.post("http://localhost:3007/login", values, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};

export default useLoginUser;
