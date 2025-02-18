/**
 * @function isFormFilled
 *
 * @description Checks if the profile form is completely filled by verifying that the first name, last name, and email fields are not empty.
 *
 * @param {string} [firstName] - The first name of the user.
 * @param {string} [lastName] - The last name of the user.
 * @param {string} [email] - The email address of the user.
 * @returns {boolean} A boolean indicating whether all form fields are filled.
 */
export const isFormFilled = (firstName?: string, lastName?: string, email?: string): boolean => {
  return !!firstName && !!lastName && !!email;
};
