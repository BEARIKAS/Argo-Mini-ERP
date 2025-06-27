import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LogoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/logout', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          setLogoutSuccess(true);
          setTimeout(() => {
            navigate('/');
          }, 1500);
        }
      } catch (error) {
        console.error('Logout error:', error);
        alert('An error occurred during logout.');
      }
    };

    if (location.pathname == "/logout") {
        logoutUser();
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 text-white font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto my-8 flex flex-col items-center justify-center"
      >
        <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-white">
            {logoutSuccess ? "Logged Out!" : "Logging Out..."}
          </h1>
          <p className="text-center text-gray-400">
            {logoutSuccess
              ? "You have been successfully logged out. Redirecting to home..."
              : "Please wait while we log you out."}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
