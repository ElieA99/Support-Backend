import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import User from '../Models/publicmodel';
import '../Types/types';

export const authUser = async (req: Request, res: Response) => {

    const token = req.header('Authorization');
    if (!token) { return res.status(401).json({ error: 'Authentication failed. ' }); }

    try {
        const decoded: any = jwt.verify(token, 'KEY');
        const user = await User.findOne({ _id: decoded._id, isAdmin: false });

        if (!user) {
            return res.status(401).json({ error: 'Authentication failed. User not found.' });
        }
        req.user = User;

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
