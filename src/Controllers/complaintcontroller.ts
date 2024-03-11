import Complaint from '../Models/complaintmodel';

import User from '../Models/publicmodel'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

//create new Complaint
export const submitComplaint = async (req: Request, res: Response) => {
    try {

        const { title, description, categories } = req.body;

        const newComplaint = new Complaint({
            title, description, categories, status: 'PENDING',
            // createdBy: User._id 
        });
        await newComplaint.save();

        return res.status(200).json({ message: 'New Complaint Created.' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//paginated ?
export const complaintPaginaited = async (req: Request, res: Response) => {
    try {

        const { page = 1, limit = 5 } = req.query;
        const id = req.params.id;

        const ifExists = await Complaint.findOne({ _id: id });
        if (!ifExists) { return res.status(404).json({ error: 'ُUser not found' }); };

        const prop = {
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
            sort: { createdAt: -1 }
        }

        const complaint = await Complaint.find({ _id: id }, prop);

        return res.status(200).json({ complaint });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//complaint detail
export const complaintDetail = async (req: Request, res: Response) => {

    try {

        const id = req.params.id
        //check if complaint is available  
        const ifExists = await Complaint.findOne({ _id: id });
        if (!ifExists) { return res.status(404).json({ error: 'ُComplaint not found' }); };

        res.status(200).json({ ifExists });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//delete 
export const deleteComplaint = async (req: Request, res: Response) => {
    try {

        const id = req.params.id

        //check if complaint is available before delete
        const ifExists = await Complaint.findOne({ _id: id });
        if (!ifExists) { return res.status(404).json({ error: 'ُComplaint not found' }); };

        const cmp = await Complaint.deleteOne({ _id: id });
        return res.status(200).json({ message: 'Complaint Deleted', cmp });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

