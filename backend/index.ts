import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import NodeCache from 'node-cache';

import usersRoutes from './routes/users.ts';


// New Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Route -> USERS
 */
app.use('/api/users', usersRoutes);

// Express goes live
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

// Server cache init
export const serverCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export default app;
