import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import NodeCache from 'node-cache';

import usersRoutes from './routes/users.ts';

// New Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'n9y##7c*zfG6*2Ynwm^J',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get('/', (req, res) => {
  if (req.session['username']) {
    res.json({ valid: true, username: req.session['username'] });
  } else {
    res.json({ valid: false });
  }
});

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
