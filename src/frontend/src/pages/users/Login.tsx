import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalMessage, setGeneralMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const emailControls = useAnimation();
  const passwordControls = useAnimation();

  const navigate = useNavigate();

  async function shake(controls) {
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    });
  }

  const loginUser = async () => {
    setGeneralMessage("");
    setMessageType("");
    setEmailError("");
    setPasswordError("");

    if (!email || !password) {
      setGeneralMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          user_email: email,
          user_password: password,
        }),
      });

      if (response.ok) {
        setGeneralMessage("Login successful! Redirecting...");
        setMessageType("success");
        setTimeout(() => navigate("/"), 1500);
      } else {
        const data = await response.json();
        if (data.error === "Email not found") {
          setEmailError(data.error);
          setMessageType("error");
          setGeneralMessage("Please fix the errors below.");
          await shake(emailControls);
        } else if (data.error === "Incorrect password") {
          setPasswordError(data.error);
          setMessageType("error");
          setGeneralMessage("Please fix the errors below.");
          await shake(passwordControls);
        } else {
          setGeneralMessage("Login failed: " + (data.error || "Unknown error"));
          setMessageType("error");
          await Promise.all([shake(emailControls), shake(passwordControls)]);
        }
      }
    } catch (error) {
      setGeneralMessage("Server error. Please try again later.");
      setMessageType("error");
      console.error(error);
      await Promise.all([shake(emailControls), shake(passwordControls)]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginUser();
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden px-auto mx-auto my-auto bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto my-8 flex flex-col items-center justify-center"
      >
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">
            Login
          </h1>

          {/* General message */}
          {generalMessage && (
            <div
              className={`mb-4 px-4 py-3 rounded ${
                messageType === "error"
                  ? "bg-red-600 text-red-100"
                  : "bg-green-600 text-green-100"
              }`}
              role="alert"
            >
              {generalMessage}
            </div>
          )}

          <form
            className="flex flex-col gap-4"
            noValidate
            onSubmit={(e) => e.preventDefault()}
          >
            <motion.div animate={emailControls}>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full p-2 border rounded-xl bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  emailError
                    ? "border-red-500 text-red-400 focus:ring-red-500"
                    : "border-gray-700 text-white"
                }`}
              />
              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </motion.div>

            <motion.div animate={passwordControls}>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full p-2 border rounded-xl bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  passwordError
                    ? "border-red-500 text-red-400 focus:ring-red-500"
                    : "border-gray-700 text-white"
                }`}
              />
              {passwordError && (
                <p className="text-red-500 text-sm mt-1">{passwordError}</p>
              )}
            </motion.div>

            <button
              type="button"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl text-lg transition-colors"
              onClick={loginUser}
            >
              Login
            </button>
          </form>

          <button
            type="button"
            className="w-full mt-4 border-2 border-blue-600 bg-transparent text-blue-600 font-semibold py-2 px-4 rounded-2xl text-lg transition-colors hover:bg-blue-600 hover:text-white"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
}
