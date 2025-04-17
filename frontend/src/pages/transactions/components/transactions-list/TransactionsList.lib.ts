import tank from '@/utils/axios';

/**
 * @function deleteTransactionById
 *
 * @description Sends a DELETE request to the server to delete a transaction by its ID.
 *              Returns a boolean indicating whether the deletion was successful.
 *
 * @param {number} id - The ID of the transaction to delete.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the transaction was successfully deleted,
 *                               or `false` otherwise.
 */
export const deleteTransactionById = async (id: number): Promise<boolean> => {
  const response = await tank.delete(`/transactions/${id}`);
  return response?.data?.code === 'DELETE_TRANSACTION_SUCCESS';
};
