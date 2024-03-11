import express from 'express'
import { signUp, signIn, forgotPassword, newOtp, verifyOtp, getCategories } from '../Controllers/publiccontroller'
import { authUser } from '../Configs/authUser';

const userRouter = express.Router();

userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);
userRouter.post('/forgotpwd', authUser, forgotPassword);
userRouter.post('/newOtp', authUser, newOtp);
userRouter.post('/verifyOtp', authUser, verifyOtp);
//
userRouter.get('/cat', getCategories);

export default userRouter;