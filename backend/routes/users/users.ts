import express from 'express';

import checkRoutes from './actions/check.ts';
import logoutRoutes from './actions/logout.ts';
import myselfRoutes from './actions/myself.ts';
import signinRoutes from './actions/signin.ts';
import signupRoutes from './actions/signup.ts';


const router = express.Router();

/**
 * Route -> USERS/MYSELF
 */
router.use('/myself', myselfRoutes);

/**
 * Route -> USERS/CHECK
 */
router.use('/check', checkRoutes);

/**
 * Route -> USERS/LOGOUT
 */
router.use('/logout', logoutRoutes);

/**
 * Route -> USERS/SIGNUP
 */
router.use('/signup', signupRoutes);

/**
 * Route -> USERS/SIGNIN
 */
router.use('/signin', signinRoutes);

export default router;
