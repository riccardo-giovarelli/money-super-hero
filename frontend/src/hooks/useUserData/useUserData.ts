import { useEffect, useState } from 'react';

import { UsersType } from '@/models/users';
import tank from '@/utils/axios';


const useUserData = () => {
  const [userData, setUserData] = useState<UsersType | null>(null);

  useEffect(() => {
    (async () => {
      const results = await tank.get('/users/myself');
      if (results?.data?.details) {
        setUserData(results.data.details);
      } else {
        throw new Error('No user data found');
      }
    })();
  }, []);

  return userData;
};

export default useUserData;
