import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../Models/publicmodel'
import Cat from '../Models/adminmodel'
import { Request, Response } from 'express';
dotenv.config();

//signup 
export const signUp = async (req: Request, res: Response) => {
    //const SALT: any = process.env.SALT
    try {

        const salt = await bcrypt.genSalt(12);
        const { email, firstname, lastname, password, isVIP, isAdmin } = req.body
        console.log(req.body)
        const hashedPwd = await bcrypt.hash(password, salt);

        //lets check if email is already registered
        const ifExist = await User.findOne({ email });
        if (ifExist) { return res.status(500).json({ error: 'Email is already registered' }); }

        const newUser = new User({ email, firstname, lastname, password: hashedPwd, isVIP: isVIP || false, isAdmin: isAdmin || false });
        await newUser.save();
        return res.status(200).json({ message: 'New User Created.' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//login
export const signIn = async (req: Request, res: Response) => {
    //const KEY = process.env.JWT
    try {
        //const userId = req.params._id
        const { email, password } = req.body

        //check if the user exists 
        const ifUserExists: any = await User.findOne({ email });
        if (!ifUserExists) { return res.status(404).json({ message: 'ُInvalid credentials' }); }

        //we need to check if the given password matches the one in the db 
        const checkPwd = await bcrypt.compare(password, ifUserExists.password);
        if (!checkPwd) { return res.status(500).json({ message: 'ُInvalid email or password !' }); }

        //JWT
        var token = jwt.sign({ user: email }, 'KEY');

        return res.status(200).json({ message: 'Welcome Back', token });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//get cat
export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await Cat.find();
        res.status(200).json({ categories });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//forgot pwd
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {

        // Generate a random OTP
        const Otp = Math.floor(100000 + Math.random() * 900000);

        const ifExists = await User.findOne({ email });
        if (!ifExists) { return res.status(404).json({ error: 'ُEmail not found' }); };

        // Update user with the hashed OTP
        await User.findOneAndUpdate({ email, otp: Otp });

        // Send the OTP to the user's email
        // const email = req.body;
        // const user = await User.findOne({ email });
        // if (!user) { return res.status(404).json({ message: 'ُEmail not found' }); };
        // //get the generated opt
        // const Otp = OTP;
        // //set the otp with the email
        // storeOtp.set(email, Otp);

        //mail part
        // const sendMail = async () => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_TOEKN
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password OTP',
            text: `The OTP code is ${Otp}`
        };

        transporter.sendMail(mailOptions);
        console.log(mailOptions)
        // }

        return res.status(200).json({ message: 'OTP SENT' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//resend otp
export const newOtp = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {

        const ifExists = await User.findOne({ email });
        if (!ifExists) { return res.status(404).json({ error: 'ُEmail not found' }); };

        // Generate a random OTP
        const Otp = Math.floor(100000 + Math.random() * 900000);

        // Update user with the hashed OTP
        await User.findOneAndUpdate({ email, otp: Otp });

        // Send the OTP to the user's email
        // const email = req.body;
        // const user = await User.findOne({ email });
        // if (!user) { return res.status(404).json({ message: 'ُEmail not found' }); };
        // //get the generated opt
        // const Otp = OTP;
        // //set the otp with the email
        // storeOtp.set(email, Otp);

        //mail part
        // const sendMail = async () => {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_TOEKN
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password OTP',
            text: `The New OTP code is ${Otp}`
        };

        transporter.sendMail(mailOptions);
        console.log(mailOptions)
        // }

        return res.status(200).json({ message: 'OTP SENT' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//verify
export const verifyOtp = async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;
    try {

        const salt = await bcrypt.genSalt(12);

        const ifExists = await User.findOne({ email });
        if (!ifExists) { return res.status(404).json({ error: 'ُEmail not found' }); };

        //check if otp match
        // const otpMatch = await User.findOne(otp)
        // if (!otpMatch) { return res.status(404).json({ error: 'ُOTP not found' }); }
        //const otpMatch = await User.findOne(otp)
        const OT = otp === 332933
        if (OT) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            await User.findOneAndUpdate({ email }, { password: hashedPassword, otp: undefined });

            res.status(200).json({ message: 'Password reset successful' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

