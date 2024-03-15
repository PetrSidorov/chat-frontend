import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .refine(
        async (value) => {
          const isUnique = await checkIfUsernameIsUnique(value);
          return isUnique;
        },
        { message: "This username is not unique" }
      ),
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
          message:
            "Password must be at least 8 characters long, include at least one lowercase letter, one uppercase letter, one number, and one special character (e.g., !, @, #, ?).",
        }
      ),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password must be filled." }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().min(2, {
      message: "Email must be at least 2 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // This ensures the error is attached to confirmPassword
  });

const checkIfUsernameIsUnique = async (username: string) => {
  try {
    const response = await axios.post("http://localhost:3007/check-username", {
      username,
    });
    return response.data.unique;
  } catch (error) {
    return false; // Username is not unique
  }
};

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    console.log("data ", values);
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        >
          {/* Username, Name, and Email fields remain unchanged */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm italic" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <Input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Confirm Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm italic" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
