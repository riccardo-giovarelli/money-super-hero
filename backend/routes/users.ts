import express from 'express';

import client from '../utils/db/client.ts';


const router = express.Router();

/**
 * Generate anagrams
 *
 * @name /make
 * @param text
 */
router.post('', async (req, res) => {
  const text = 'INSERT INTO users("firstName", "lastName", "email", "password") VALUES($1, $2, $3, $4)';
  const values = Object.values(req.body);
  const response = await client.query(text, values);

  console.log(response.rowCount);
});

export default router;
