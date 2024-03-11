//import the packages
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import express from 'express';
dotenv.config();
import bodyparser from 'body-parser'
import http from 'http';
import { Server } from 'socket.io';

//routes
import userRouter from '../src/Routes/publicroutes'
import complaintRoutes from '../src/Routes/complaintroutes'
import adminRoute from './Routes/adminroutes';

const app = express();
const DB = process.env.URL
const PORT = process.env.PORT

const server = http.createServer(app);
const io = new Server(server);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", userRouter);
app.use("/complaint", complaintRoutes);
app.use("/admin", adminRoute);


io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('a user disconnected');
    });
});

export { io };

//check if there is a valid url for the db
if (!DB) {
    console.log('NO DB URL');
    process.exit();
}

//connect tp mongodb and start the server
mongoose.connect(DB, {
    // useNewUrlParser: true,
    //useUnifiedTopology: true,
    family: 4 //To Prevent Connection Error
})
    .then(result => {
        app.listen(PORT, () => { console.log(`Server is running on PORT :${PORT}`); })
    })
    .catch(err => {
        console.log(err);
    });
