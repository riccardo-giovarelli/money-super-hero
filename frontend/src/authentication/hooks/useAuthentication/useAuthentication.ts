import axios from 'axios';
import { NavigateFunction } from 'react-router';

import { useAuthenticationStore } from '@/authentication/AuthenticationStore/AuthenticationStore';


const useAuthentication = () => {
  const setLogout = useAuthenticationStore((state) => state.setLogout);
  /**
   * @function isAuthenticated
   *
   * @description Checks if the user is authenticated by making a GET request to the authentication endpoint.
   * The function sends a request with credentials and expects a response indicating the authentication status.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if the user is authenticated (i.e., the response code is 'LOGGED_IN'),
   * otherwise resolves to false.
   *
   * @throws {Error} If there is an error during the request, it logs the error and returns false.
   */
  const isAuthenticated = async (): Promise<boolean> => {
    try {
      const results = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`, { withCredentials: true });
      return results?.data?.code === 'LOGGED_IN';
    } catch (error) {
      console.log('Authentication error', error);
      return false;
    }
  };

  /**
   * @function checkAuthentication
   *
   * @description Checks if the user is authenticated by calling the isAuthenticated function. If the user is not authenticated,
   * it navigates to the '/signin' route.
   *
   * @param {NavigateFunction} navigate - The navigate function from react-router used to programmatically navigate to different routes.
   *
   * @returns {Promise<void>} A promise that resolves when the authentication check is complete.
   */
  const checkAuthentication = async (navigate: NavigateFunction): Promise<void> => {
    const authentication = await isAuthenticated();
    if (!authentication) {
      navigate('/signin');
    }
  };

  const logout = async () => {
    try {
      const results = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/logout`, { withCredentials: true });
      if (results?.data?.code === 'LOGGED_OUT') {
        setLogout();
      } else {
        throw new Error('Error logging out');
      }
    } catch (error) {
      console.log('Authentication error', error);
      return false;
    }
  };

  return { isAuthenticated, checkAuthentication, logout };
};

export default useAuthentication;
