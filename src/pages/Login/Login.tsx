import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import fetchDB from "../../utils/fetchDB";
import pickProperties from "../../utils/pickProperties";
export default function Login() {
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
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

  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((data) => {
      return {
        ...data,
        [e.target.name]: e.target.value,
      };
    });
  }

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let dataToSend = null;
    if (!isNewUser) {
      dataToSend = pickProperties(formData, "username", "password");
    } else {
      dataToSend = pickProperties(formData, "username", "password", "email");
    }

    fetchDB({
      url: isNewUser
        ? "http://localhost:3007/register"
        : "http://localhost:3007/login",
      method: "POST",
      body: formData,
    })
      .then((data) => {
        console.log("Success:", data);
        if (data.token) {
          navigate("/chat");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
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
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none borderrounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none
            focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <AnimatePresence>
            {isNewUser && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                transition={{ duration: 0.5, ease: [0.6, -0.28, 0.735, 0.045] }}
                className="mb-6 "
                layout
                key="nameField"
              >
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  className="shadow appearance-none borderrounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none
            focus:shadow-outline"
                  id="name"
                  type="text"
                  placeholder="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {isNewUser && (
              <motion.div
                layout
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                transition={{ duration: 0.5, ease: [0.6, -0.28, 0.735, 0.045] }}
                className="mb-6"
              >
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none borderrounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none
            focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded
            w-full py-2 px-3 text-gray-700 mb-3
            leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {/* <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p> */}
          </div>
          <AnimatePresence>
            {isNewUser && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={containerVariants}
                transition={{ duration: 0.5, ease: [0.6, -0.28, 0.735, 0.045] }}
                className="mb-6"
              >
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="verifyPassword"
                >
                  Verify password
                </label>
                <input
                  className="shadow appearance-none borderrounded w-full py-2 px-3
            text-gray-700 leading-tight focus:outline-none
            focus:shadow-outline"
                  id="verifyPassword"
                  type="password"
                  placeholder="verifyPassword"
                  name="verifyPassword"
                  value={formData.verifyPassword}
                  onChange={handleChange}
                />
              </motion.div>
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
