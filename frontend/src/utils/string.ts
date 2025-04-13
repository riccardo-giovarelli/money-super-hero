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

/**
 * @function isValidNumber
 *
 * @description Validates whether a given string contains only numeric digits. The function uses a regular expression
 * to check if the string consists entirely of digits (0-9). It returns true if the string is a valid number, and false otherwise.
 *
 * @param {string} value - The string to validate.
 * @returns {boolean} A boolean indicating whether the string contains only numeric digits.
 */
export const isValidNumber = (value: string): boolean => /^\d+$/.test(value);
