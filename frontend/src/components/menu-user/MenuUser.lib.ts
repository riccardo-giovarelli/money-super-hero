import { NavigateFunction } from 'react-router';


/**
 * @function handleLogoutClick
 *
 * @description Handles the logout process by calling the provided `logout` function to log the user out,
 * and then calling the `handleClose` function to close the menu.
 *
 * @param {() => void} logout - The function to log the user out.
 * @param {() => void} handleClose - The function to close the menu.
 */
export const handleLogoutClick = (logout: () => void, navigate: NavigateFunction): void => {
  logout();
  navigate('/');
};
