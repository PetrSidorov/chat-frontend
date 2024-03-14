import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useEffect } from "react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
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
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const watchFields = form.watch(["username"]);
  console.log(watchFields);

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  // useEffect(() => {
  //   const subscription = form.watch((value, { name, type }) =>
  //     console.log(value, name, type)
  //   );
  //   return () => subscription.unsubscribe();
  // }, [form.watch]);

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
                    placeholder="shadcn"
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
                    placeholder="shadcn"
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
