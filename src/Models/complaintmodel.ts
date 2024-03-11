import mongoose, { Schema } from 'mongoose';
import config from "../Configs/config"

const complaintSchema: Schema = new Schema({

    title: String,
    description: String,
    categories: String,
    status: { type: String, enum: ['PENDING', 'INPROGRESS', 'RESOLVED', 'REJECTED'], default: 'PENDING' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Admin" },
    createdAt: Date
},
    { timestamps: true }
)

export default mongoose.model('Complaint', complaintSchema)