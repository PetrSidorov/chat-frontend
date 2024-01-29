import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import fetchDB from "../../utils/FetchDB";
import pickProperties from "../../utils/pickProperties";
import { AuthContext } from "../../context/AuthContext";
import LoginFormField from "./LoginFormField";
import useFetchDB from "../../hooks/useFetchDB";
import {
  TAuthContext,
  TDataBaseRequestData,
  TLoginDataBaseResponse,
  TUser,
} from "../../types";

export default function Login() {
  const [user, setUser] = useContext<TAuthContext>(AuthContext);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  // const [submitData, setSubmitData] = useState<TDataBaseRequestData | null>(
  //   null
  // );
  const { loading, data, error, setFetchData } =
    useFetchDB<TLoginDataBaseResponse | null>();

  const [formData, setFormData] = useState<{
    name: string;
    username: string;
    password: string;
    email: string;
    verifyPassword: string;
  }>({
    name: "",
    username: "",
    password: "",
    email: "",
    verifyPassword: "",
  });

  const navigate = useNavigate();

  function toggleNewUser(shouldBeNewUser: boolean) {
    if (shouldBeNewUser != isNewUser) {
      setIsNewUser(shouldBeNewUser);
    }
  }

  useEffect(() => {
    if (data && data.token) {
      console.log("data resp: ", data);
      setUser(data.user);
      navigate("/chat");
    }
  }, [data]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((data) => {
      return {
        ...data,
        [e.target.name]: e.target.value,
      };
    });
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const bodyData = isNewUser
      ? pickProperties(formData, "username", "password", "email")
      : pickProperties(formData, "username", "password");

    setFetchData({
      url: isNewUser
        ? "http://localhost:3007/register"
        : "http://localhost:3007/login",
      method: "POST",
      body: bodyData,
    });
  }
  return (
    <div className="flex justify-center content-center h-screen flex-wrap">
      <motion.div
        layout
        className="w-full max-w-xs bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="flex justify-between pb-8">
          <button
            onClick={() => toggleNewUser(true)}
            className={
              isNewUser
                ? `bg-blue-500 hover:bg-blue-700 text-white font-bold
            py-2 px-4 rounded focus:outline-none focus:shadow-outline`
                : `font-bold align-baseline
            text-blue-500 hover:text-blue-800 py-2 px-4 `
            }
            type="button"
          >
            Register
          </button>
          <button
            onClick={() => toggleNewUser(false)}
            className={
              !isNewUser
                ? `bg-blue-500 hover:bg-blue-700 text-white font-bold
            py-2 px-4 rounded focus:outline-none focus:shadow-outline`
                : `font-bold align-baseline
            text-blue-500 hover:text-blue-800 py-2 px-4 `
            }
            type="button"
          >
            Sign in
          </button>
        </div>

        <form onSubmit={submitForm}>
          <LoginFormField
            value={formData.username}
            handleChange={handleChange}
            placeholder="Username"
            name="username"
            type="string"
          />
          <AnimatePresence>
            {isNewUser && (
              <LoginFormField
                value={formData.name}
                handleChange={handleChange}
                placeholder="Name"
                name="name"
                animations={true}
                type="string"
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isNewUser && (
              <LoginFormField
                value={formData.email}
                handleChange={handleChange}
                placeholder="Email"
                name="email"
                animations={true}
                type="email"
              />
            )}
          </AnimatePresence>
          <LoginFormField
            value={formData.password}
            handleChange={handleChange}
            placeholder="Password"
            name="password"
            animations={true}
            type="password"
          />
          {/* <p className="text-red-500 text-xs italic mb-3">
              Please choose a password.
            </p> */}
          <AnimatePresence>
            {isNewUser && (
              <LoginFormField
                value={formData.verifyPassword}
                handleChange={handleChange}
                placeholder="Verify password"
                name="verifyPassword"
                animations={true}
                type="password"
              />
            )}
            {formData.password !== formData.verifyPassword && (
              <p className="text-red-500 text-xs italic mb-3">
                Passwords mismatch.
              </p>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold
            py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Let's go!
            </button>
            <a
              className="inline-block align-baseline font-bold text-sm
            text-blue-500 hover:text-blue-800"
              href="#"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
