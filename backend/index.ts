import 'dotenv/config';

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import NodeCache from 'node-cache';

import categoriesRoutes from './routes/categories/categories.ts';
import subcategoriesRoutes from './routes/sub-categories/sub-categories.ts';
import transactionsRoutes from './routes/transactions/transactions.ts';
import usersRoutes from './routes/users/users.ts';

// New Express
const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    name: 'money-super-hero-session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

/**
 * Route -> USERS
 */
app.use('/api/users', usersRoutes);

/**
 * Route -> CATEGORIES
 */
app.use('/api/categories', categoriesRoutes);

/**
 * Route -> SUB-CATEGORIES
 */
app.use('/api/subcategories', subcategoriesRoutes);

/**
 * Route -> TRANSACTIONS
 */
app.use('/api/transactions', transactionsRoutes);

// Express goes live
app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});

// Server cache init
export const serverCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export default app;
