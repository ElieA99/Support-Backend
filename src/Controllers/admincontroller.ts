import Admin from '../Models/adminmodel';
import { Request, Response } from 'express';
import Complaint from '../Models/complaintmodel';
import { io } from '../server'

//new category 
export const addCategory = async (req: Request, res: Response) => {
    try {

        const { name } = req.body;
        const newCat = new Admin({ name });

        await newCat.save();
        return res.status(200).json({ message: 'New Category Created.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//get clients complains
export const getComplains = async (req: Request, res: Response) => {
    try {
        const complaints = await Complaint.find({})
            .sort({ createdAt: -1 }) // Sort by creation date  
            .populate('createdBy', 'email');

        res.status(200).json({ complaints });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


//delete category 
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        //check if the category is available
        const ifExists = await Admin.findOne({ _id: id });
        if (!ifExists) { return res.status(404).json({ error: 'ُCategory not found' }); };

        const cat = await Admin.deleteOne({ _id: id });

        return res.status(200).json({ message: 'Category Deleted', data: cat });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//update category
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const id = req.params.id;

        const ifExists = await Admin.findOne({ _id: id });
        if (!ifExists) { return res.status(404).json({ error: 'ُCategory not found' }); };

        const category = await Admin.updateOne({ id, name });
        return res.status(200).json({ message: 'Category Updated', data: category });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//update status
export const updateStatus = async (req: Request, res: Response) => {
    try {

        const complaintId = req.params;
        const status = req.body;

        const ifExists = await Admin.findOne({ _id: complaintId });
        if (!ifExists) { return res.status(404).json({ error: 'ُComplaint not found' }); };

        const result = await Admin.updateOne({ complaintId, status });

        //
     //   io.to(result.email).emit('Status changed',{Status:status});

        return res.status(200).json({ message: 'Complaint Updated', data: result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}