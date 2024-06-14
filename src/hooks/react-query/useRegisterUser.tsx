import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
// TODO: all validation stuff should be passed here,
// because it's duplicated in register page

const formSchema = z.object({
  username: z.string().min(1, { message: "This field has to be filled." }),
  name: z.string().min(1, { message: "This field has to be filled." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(1)
    .refine(
      (value) => {
        return (
          value.length >= 8 &&
          /[a-z]/.test(value) &&
          /[A-Z]/.test(value) &&
          /[0-9]/.test(value) &&
          /[^a-zA-Z0-9]/.test(value)
        );
      },
      {
        message: `Password must be at least 8 characters long,
          include at least one lowercase letter, one uppercase letter,
          one number, and one special character (e.g., !, @, #, ?).`,
      }
    ),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm password must be filled." }),
});

type RegisterFormValues = z.infer<typeof formSchema>;

const registerUser = async (values: RegisterFormValues) => {
  const response = await axios.post("http://localhost:3007/register", values, {
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};

const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};

export default useRegisterUser;
