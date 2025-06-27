import { useEffect, useState } from 'react';

export default function UserStatus() {
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/current_user', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.user_first_name);
        } else {
          setUsername('');
        }
      } catch (error) {
        console.error('Error fetching user status:', error);
        setUsername('');
      }
    };

    fetchUsername();
  }, []);

  return (
    <div className="text-white text-sm p-2">
      {username ? `Hello, ${username}` : ''}
    </div>
  );
}
