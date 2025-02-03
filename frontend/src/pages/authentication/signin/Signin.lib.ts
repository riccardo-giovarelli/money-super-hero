/**
 * Checks if the login form is completely filled.
 *
 * @param email - The email address for the login.
 * @param password - The password for the login.
 * @returns A boolean indicating whether all form fields are filled.
 */
export const isFormFilled = (email: string, password: string): boolean => {
  return !!email && !!password;
};
