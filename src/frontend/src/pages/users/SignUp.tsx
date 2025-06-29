import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [retypeError, setRetypeError] = useState("");

  const [generalMessage, setGeneralMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const emailControls = useAnimation();
  const passwordControls = useAnimation();
  const retypeControls = useAnimation();

  const navigate = useNavigate();

  async function shake(controls) {
    await controls.start({
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 },
    });
  }

  function validatePassword(pw) {
    return pw.length >= 8 && /[0-9]/.test(pw) && /[a-zA-Z]/.test(pw);
  }

  const signUpUser = async (e) => {
    e.preventDefault();

    setGeneralMessage("");
    setMessageType("");
    setEmailError("");
    setPasswordError("");
    setRetypeError("");

    if (!firstName || !lastName || !email || !password || !retypePassword) {
      setGeneralMessage("Please fill in all fields.");
      setMessageType("error");
      return;
    }

    if (password !== retypePassword) {
      setPasswordError("Passwords do not match");
      setRetypeError("Passwords do not match");
      setMessageType("error");
      setGeneralMessage("Please fix the errors below.");
      await Promise.all([shake(passwordControls), shake(retypeControls)]);
      return;
    }

    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters and contain letters and numbers"
      );
      setMessageType("error");
      setGeneralMessage("Please fix the errors below.");
      await Promise.all([shake(passwordControls), shake(retypeControls)]);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/signUp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_first_name: firstName,
          user_last_name: lastName,
          user_email: email,
          user_password: password,
        }),
      });

      if (response.ok) {
        setGeneralMessage("Sign-up succeeded! Redirecting...");
        setMessageType("success");
        setTimeout(() => navigate("/"), 300);
      } else {
        const data = await response.json();
        if (data.error === "Email already registered") {
          setEmailError(data.error);
          setMessageType("error");
          setGeneralMessage("Please fix the errors below.");
          await shake(emailControls);
        } else {
          setGeneralMessage(
            "Sign-up unsuccessful: " + (data.error || "Unknown error")
          );
          setMessageType("error");
          await Promise.all([shake(passwordControls), shake(retypeControls)]);
        }
      }
    } catch (err) {
      setGeneralMessage("Server error. Please try again later.");
      setMessageType("error");
      console.error(err);
      await Promise.all([shake(passwordControls), shake(retypeControls)]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      signUpUser(e);
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
            Sign Up
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

          <form className="flex flex-col gap-4" noValidate>
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                required
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                required
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full p-2 border rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {/* Retype Password */}
            <motion.div animate={retypeControls}>
              <label
                htmlFor="retypePassword"
                className="block text-sm font-medium mb-1 text-gray-300"
              >
                Retype Password
              </label>
              <input
                id="retypePassword"
                type="password"
                required
                placeholder="Retype your password"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`w-full p-2 border rounded-xl bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  retypeError
                    ? "border-red-500 text-red-400 focus:ring-red-500"
                    : "border-gray-700 text-white"
                }`}
              />
              {retypeError && (
                <p className="text-red-500 text-sm mt-1">{retypeError}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl text-lg transition-colors"
              onClick={signUpUser}
            >
              Create Account
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  Login
                </span>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
