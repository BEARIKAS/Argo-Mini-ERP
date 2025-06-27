import { useState } from 'react'
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const signUpUser = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !email) {
      alert('Please fill in all fields.');
      return;
    }
    
    try {
      const target_url = `http://127.0.0.1:5000/signUp?user_first_name=${encodeURIComponent(firstName)}&user_last_name=${encodeURIComponent(lastName)}&user_email=${encodeURIComponent(email)}`;
      const response = await fetch(target_url);
      // console.log(response.status)
      if (response.ok) {
        alert('Sign-up succeeded!');
        navigate('/');
      } else {
        alert('Sign-up UNSUCCESSFUL');
      }
    }
    catch (err) {
      alert('Server error');
      console.log(err);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      signUpUser(e);
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden px-auto mx-auto my-auto bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans">
    {/* "flex items-center justify-center bg-gray-900 p-4"> */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto my-8 flex flex-col items-center justify-center"
      >
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">Sign Up</h1>
          <form className="flex flex-col gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-300">
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
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-gray-300">
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
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
                className="w-full p-2 border rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-2xl text-lg transition-colors"
              onClick={(e) => signUpUser(e)}            
            >
              Create Account
            </button>
    
          </form>
        </div>
      </motion.div>
    </div>
  );
}
