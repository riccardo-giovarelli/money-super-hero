import express from 'express';
import pg from 'pg';

import { authenticationMiddleware } from '../users/users.lib.ts';

const router = express.Router();
const { Client } = pg;

router.get('/', authenticationMiddleware, async (req, res) => {
  const client = new Client();
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    await client.connect();
    const query = {
      name: 'get-categories-with-pagination',
      text: 'SELECT "name", "notes" FROM categories LIMIT $1 OFFSET $2;',
      values: [Number(limit), offset],
    };
    const results = await client.query(query);
    if (results?.rowCount < 1) {
      res.status(200).json({ code: 'GET_CATEGORIES_ERROR', message: 'No categories found', details: '' });
    } else {
      res.status(200).json({
        code: 'GET_CATEGORIES_SUCCESS',
        message: 'Successfully retrieved categories',
        details: results.rows,
      });
    }
  } catch (err) {
    res.status(500).json({ code: 'GET_CATEGORIES_ERROR', message: 'Error retrieving categories', details: err });
  } finally {
    await client.end();
  }
});

export default router;
