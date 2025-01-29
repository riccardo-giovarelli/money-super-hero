/**
 * Checks if the registration form is completely filled.
 *
 * @param firstName - The first name of the user.
 * @param lastName - The last name of the user.
 * @param email - The email address of the user.
 * @param passwordIsValid - A boolean indicating if the password meets validation criteria.
 * @returns A boolean indicating whether all form fields are filled and the password is valid.
 */
export const isFormFilled = (firstName: string, lastName: string, email: string, passwordIsValid: boolean): boolean => {
  return !!firstName && !!lastName && !!email && !!passwordIsValid;
};
