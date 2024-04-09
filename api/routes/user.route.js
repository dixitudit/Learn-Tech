import express from 'express';
import { test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// here verifyToken is a middleware that will be executed before updateUser where we are just checking if the token is present in the cookie or not. i.e. if the user is authenticated or not.
router.put('/update/:userId', verifyToken ,updateUser);
router.get('/test', test);

export default router;