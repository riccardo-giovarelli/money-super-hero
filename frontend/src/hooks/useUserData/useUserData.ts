import axios from 'axios';
import { useEffect, useState } from 'react';

import { UsersType } from '@/models/users';

const useUserData = () => {
  const [userData, setUserData] = useState<UsersType | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const results = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/myself`, {
          withCredentials: true,
        });
        if (results?.data?.details) {
          setUserData(results.data.details);
        } else {
          throw new Error('No user data found');
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      }
    })();
  }, []);

  return userData;
};

export default useUserData;
