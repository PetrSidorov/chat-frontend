import { useState, useEffect } from "react";
export default function Login() {
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
  }>({ username: "", password: "" });

  function toggleNewUser(shouldBeNewUser: boolean) {
    if (shouldBeNewUser != isNewUser) {
      setIsNewUser(shouldBeNewUser);
    }
  }

  useEffect(() => {
    console.log(isNewUser);
  }, [isNewUser]);

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
    fetch("http://localhost:3007/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.token) {
          // redirect to /chat
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  return (
    <div className="flex justify-center content-center h-screen flex-wrap">
      <div className="w-full max-w-xs bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex justify-between pb-8">
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
        </div>

        <form onSubmit={submitForm}>
          <div className="mb-4">
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
            <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold
            py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
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
      </div>
    </div>
  );
}
