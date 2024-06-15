import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";

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
import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "@/context/AuthProvider";
import { Eye, EyeOff } from "lucide-react";
import { socket } from "@/utils/socket";
import useLoginUser from "@/hooks/react-query/useLoginUser";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(2),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  //
  const { setUser, user, setStatus } = useContext(AuthContext);
  const loginUser = useLoginUser();

  // useEffect(() => {
  //   if (user) {
  //     navigate("/messages");
  //   }
  // }, [user]);

  // function waitForSocketConnection() {
  //   return new Promise((resolve, reject) => {
  //     const onConnect = () => {
  //       socket.off("connect", onConnect);
  //       socket.off("connect_error", onConnectError);
  //       resolve(null);
  //     };
  //     const onConnectError = (error: any) => {
  //       socket.off("connect", onConnect);
  //       socket.off("connect_error", onConnectError);
  //       reject(error);
  //     };

  //     if (socket.connected) {
  //       resolve(null);
  //     } else {
  //       socket.on("connect", onConnect);
  //       socket.on("connect_error", onConnectError);
  //       socket.connect();
  //     }
  //   });
  // }

  async function onSubmit(values: LoginFormValues) {
    loginUser.mutate(values, {
      onSuccess: () => navigate("/messages"),
      // event.target.reset(),
    });
    // try {
    //   const response = await axios.post("http://localhost:3007/login", values, {
    //     withCredentials: true,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const data = response.data;
    //   if (data && data?.token) {
    //     setUser(data.user);
    //     setStatus(200);
    //     navigate("/messages");
    //     // waitForSocketConnection();
    //     console.log("setUser() && navigate()");
    //   }
    // } catch (error: any) {
    //   if (error.response) {
    //     form.setError("username", {
    //       type: "server",
    //       message: error.response.data.message,
    //     });
    //   } else if (error.request) {
    //     form.setError("username", {
    //       type: "server",
    //       message: "Please try again later",
    //     });
    //   } else {
    //     form.setError("username", {
    //       type: "server",
    //       message: "Please try again",
    //     });
    //   }
    // }
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
                    placeholder="Enter your username"
                    type="text"
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
                    placeholder="Enter password"
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
          <div className="flex justify-between items-center">
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </Button>
            <a
              className="font-bold text-sm text-blue-500 hover:text-blue-800 pr-4"
              href="/register"
            >
              Create account
            </a>
          </div>
        </form>
      </Form>
    </div>
  );
}
