import express from 'express';
import { test, updateUser, deleteUserByAdmin ,deleteUser, signout, getUsers } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// here verifyToken is a middleware that will be executed before updateUser where we are just checking if the token is present in the cookie or not. i.e. if the user is authenticated or not.
router.put('/update/:userId', verifyToken ,updateUser);
router.delete('/delete/:userId', verifyToken ,deleteUser);
router.get('/test', test);
router.post('/signout', signout);
router.get('/getusers/:userId', verifyToken, getUsers);
router.delete('/deleteuser/:delUserId/:userId', verifyToken, deleteUserByAdmin);

export default router;