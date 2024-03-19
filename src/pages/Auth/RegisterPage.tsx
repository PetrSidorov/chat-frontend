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
import { AuthContext } from "@/context/AuthProvider";
// import { TAuthContext } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const formSchema = z
  .object({
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
  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const checkIfUsernameIsUnique = async (username: string) => {
  try {
    const response = await axios.post("http://localhost:3007/check-username", {
      username,
    });

    return response.data;
  } catch (error) {
    return false;
  }
};

const checkIfEmailIsUnique = async (email: string) => {
  try {
    const response = await axios.post("http://localhost:3007/check-email", {
      email,
    });

    return response.data;
  } catch (error) {
    return false;
  }
};

type LoginFormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
  const watchedUsername = form.watch("username");
  const watchedEmail = form.watch("email");

  useEffect(() => {
    async function handleUniqueUser() {
      if (watchedUsername) {
        const isUnique = await checkIfUsernameIsUnique(watchedUsername);

        if (!isUnique) {
          form.setError("username", {
            type: "server",
            message: "This username is already taken",
          });
        } else {
          form.clearErrors("username");
        }
      }
    }
    handleUniqueUser();
  }, [watchedUsername]);

  useEffect(() => {
    async function handleUniqueEmail() {
      if (watchedEmail) {
        const isUnique = await checkIfEmailIsUnique(watchedEmail);

        if (!isUnique) {
          form.setError("email", {
            type: "server",
            message: "This email is already in use",
          });
        } else {
          form.clearErrors("email");
        }
      }
    }
    handleUniqueEmail();
  }, [watchedEmail]);

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await axios.post(
        "http://localhost:3007/register",
        values,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data && data?.token) {
        setUser(data.user);
        navigate("/messages");
      }
    } catch (error: any) {
      if (error.response) {
        form.setError("username", {
          type: "server",
          message: error.response.data.message,
        });
      } else if (error.request) {
        form.setError("username", {
          type: "server",
          message: "Please try again later",
        });
      } else {
        form.setError("username", {
          type: "server",
          message: "Please try again",
        });
      }
    }
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
                    placeholder="Username"
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
                    placeholder="Enter your name"
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
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="email"
                    type="email"
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
              <FormItem className="mb-4 relative">
                <FormLabel className="block text-gray-700 text-sm font-bold mb-2">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <Button
                  size="icon"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-sm text-blue-500 hover:underline focus:outline-none absolute top-5 right-0"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
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
                    type={showPassword ? "text" : "password"}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500 text-sm italic" />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Submit
            </Button>
            <a
              className="font-bold text-sm text-blue-500 hover:text-blue-800 pr-4"
              href="/login"
            >
              Sign in
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}
