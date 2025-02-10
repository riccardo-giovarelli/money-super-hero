/**
 * @function isFormFilled
 *
 * @description Checks if the login form is completely filled by verifying that both the email and password fields are not empty.
 *
 * @param {string} email - The email address entered in the login form.
 * @param {string} password - The password entered in the login form.
 * @returns {boolean} A boolean indicating whether both the email and password fields are filled.
 */
export const isFormFilled = (email: string, password: string): boolean => {
  return !!email && !!password;
};
