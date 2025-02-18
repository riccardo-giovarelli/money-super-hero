/**
 * @function isFormFilled
 *
 * @description Checks if the registration form is completely filled by verifying that the first name, last name, and email fields are not empty,
 * and that the password meets the validation criteria.
 *
 * @param {string} firstName - The first name of the user.
 * @param {string} lastName - The last name of the user.
 * @param {string} email - The email address of the user.
 * @param {boolean} passwordIsValid - A boolean indicating if the password meets validation criteria.
 * @returns {boolean} A boolean indicating whether all form fields are filled and the password is valid.
 */
export const isFormFilled = (
  passwordIsValid: boolean,
  firstName?: string,
  lastName?: string,
  email?: string
): boolean => {
  return !!firstName && !!lastName && !!email && !!passwordIsValid;
};
