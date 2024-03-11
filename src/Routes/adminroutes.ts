import express from 'express';
import { addCategory, deleteCategory, updateCategory, getComplains } from '../Controllers/admincontroller';
import { authAdmin } from '../Configs/authadmin';

const adminRoute = express.Router();

adminRoute.delete('/category/:id', authAdmin, deleteCategory);
adminRoute.post('/category', authAdmin, addCategory);
adminRoute.put('/category', authAdmin, updateCategory);

adminRoute.get('/clients', getComplains);

export default adminRoute;