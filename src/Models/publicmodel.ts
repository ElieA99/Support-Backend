import mongoose, { Schema } from 'mongoose';
import config from "../Configs/config"

const userSchema: Schema = new Schema({
    
    email: String,
    firstname: String,
    lastname: String,
    password: String,
    otp: Number,
    isVIP: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false }
},
    { timestamps: true }
)

export default mongoose.model('User', userSchema)