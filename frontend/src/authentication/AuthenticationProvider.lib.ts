import axios from 'axios';

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const results = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`, { withCredentials: true });
    return results?.data?.code === 'LOGGED_IN';
  } catch (error) {
    console.log('Authentication error', error);
    return false;
  }
};
