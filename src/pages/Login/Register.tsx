import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullScreenLoading from "../../components/FullScreenLoading";
import { AuthContext } from "../../context/AuthProvider";
import useFetchDB from "../../hooks/useFetchDB";
import { TAuthContext, TLoginDataBaseResponse } from "../../types";
import LoginFormField from "./LoginFormField";

export default function RegisterForm() {
  const { setUser } = useContext<TAuthContext>(AuthContext);
  const { loading, data, setFetchData } =
    useFetchDB<TLoginDataBaseResponse | null>();
  const [formData, setFormData] = useState<{
    name: string;
    username: string;
    email: string;
    password: string;
    verifyPassword: string;
  }>({
    name: "",
    username: "",
    email: "",
    password: "",
    verifyPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (data && data?.token) {
      setUser(data.user);
      navigate("/messages");
    }
  }, [data]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  }

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setFetchData({
      url: "http://localhost:3007/register",
      method: "POST",
      body: {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
    });
  }

  return (
    <>
      {loading ? (
        <FullScreenLoading />
      ) : (
        <div className="flex justify-center content-center h-screen flex-wrap">
          <div className="w-full max-w-xs bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="flex justify-between pb-8">
              <p className="font-bold align-baseline text-blue-500 py-2 px-4">
                Register
              </p>
            </div>
            <form onSubmit={submitForm}>
              <LoginFormField
                value={formData.username}
                handleChange={handleChange}
                placeholder="Username"
                name="username"
                type="string"
              />
              <LoginFormField
                value={formData.name}
                handleChange={handleChange}
                placeholder="Name"
                name="name"
                type="string"
              />
              <LoginFormField
                value={formData.email}
                handleChange={handleChange}
                placeholder="Email"
                name="email"
                type="email"
              />
              <LoginFormField
                value={formData.password}
                handleChange={handleChange}
                placeholder="Password"
                name="password"
                type="password"
              />
              <LoginFormField
                value={formData.verifyPassword}
                handleChange={handleChange}
                placeholder="Verify password"
                name="verifyPassword"
                type="password"
              />
              {formData.password !== formData.verifyPassword && (
                <p className="text-red-500 text-xs italic mb-3">
                  Passwords mismatch.
                </p>
              )}
              <div className="flex items-center justify-between">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Let's go!
                </button>
                <a
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
