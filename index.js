import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './DataBase/DbConfig.js';
import propertyRouter from './Routers/properties.router.js';
import userRouter from './Routers/user.router.js';

dotenv.config()

const app = express();
app.use(cors(
    {
        origin:process.env.CLIENT_URL,credentials:true
    }
))
app.use(express.json())
app.use(cookieParser())

connectDB()
const port = process.env.PORT || 3001
app.use('/api',propertyRouter)
app.use('/api/user',userRouter)


app.listen(port,()=>{
    console.log(`The server is Running at Port- ${port}`);
})