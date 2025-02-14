import { NavigateFunction } from 'react-router';


/**
 * @function handleLogoutClick
 *
 * @description Handles the logout process by calling the provided `logout` function to log the user out,
 * navigating to the home page, and then calling the `handleClose` function to close the menu.
 *
 * @param {() => void} logout - The function to log the user out.
 * @param {NavigateFunction} navigate - The navigate function from react-router used to programmatically navigate to different routes.
 * @param {() => void} handleClose - The function to close the menu.
 */
export const handleLogoutClick = (logout: () => void, navigate: NavigateFunction, handleClose: () => void): void => {
  logout();
  navigate('/');
  handleClose();
};

/**
 * @function handleProfileClick
 *
 * @description Handles the profile navigation by navigating to the profile page and then calling the `handleClose` function to close the menu.
 *
 * @param {NavigateFunction} navigate - The navigate function from react-router used to programmatically navigate to different routes.
 * @param {() => void} handleClose - The function to close the menu.
 */
export const handleProfileClick = (navigate: NavigateFunction, handleClose: () => void): void => {
  navigate('/profile');
  handleClose();
};
