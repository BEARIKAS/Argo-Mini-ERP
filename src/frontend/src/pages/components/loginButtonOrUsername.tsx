import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginButtonOrUsername() {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const NOT_LOGGED_IN_UNAME = '';

    const fetchUsername = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/current_user',
                {credentials: 'include'}
            )
            if (response.ok) {
                const data = await response.json();
                setUsername(data.user_first_name);
            } else {
                setUsername(NOT_LOGGED_IN_UNAME);
            }
        } catch (err) {
            setUsername(NOT_LOGGED_IN_UNAME);
        }
    }

    useEffect(() => {
        fetchUsername();
    }, []);

    return (
        <div className="text-white text-sm p-2 flex justify-end items-center gap-4">
          {username ? (
            // <span>Hello, {username}</span>
            <button 
                onClick={() => navigate('/logout')}
                className="px-4 py-2 bg-white text-black rounded-lg font-semibold text-sm hover:bg-zinc-200 transition"
            >
            Logout, {username}
          </button>
          ) : (
            <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-white text-black rounded-lg font-semibold text-sm hover:bg-zinc-200 transition"
            >
            Login
          </button>
          )}
        </div>
      );

}