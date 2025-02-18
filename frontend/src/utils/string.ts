/**
 * @function isValidEmailAddress
 *
 * @description Validates an email address using a regular expression. The function checks if the provided email
 * address matches the pattern for a valid email format. It returns true if the email is valid, and false otherwise.
 *
 * @param {string} email - The email address to validate.
 * @returns {boolean} A boolean indicating whether the email address is valid.
 */
export const isValidEmailAddress = (email: string): boolean => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
