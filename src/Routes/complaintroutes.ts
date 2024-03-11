import express from 'express';
import { submitComplaint, deleteComplaint, complaintDetail, complaintPaginaited } from '../Controllers/complaintcontroller'
import { authUser } from '../Configs/authUser';

const complaintRoutes = express.Router();

complaintRoutes.post('/submit', authUser, submitComplaint);
complaintRoutes.delete('/delete/:id', authUser, deleteComplaint);

complaintRoutes.get('/pagination/:id', authUser, complaintPaginaited);
complaintRoutes.get('/details/:id', authUser, complaintDetail);

export default complaintRoutes;