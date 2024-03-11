import mongoose, { Schema } from 'mongoose';
import config from "../Configs/config"

//for category
const AdminSchema: Schema = new Schema({
    name: String,
},
    { timestamps: true }
);

export default mongoose.model('Admin', AdminSchema)