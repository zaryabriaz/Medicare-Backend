import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors'
import mongoose from "mongoose"
import dotenv from 'dotenv'
import authRoute from './routes/auth.js'
import userRoute from './routes/user.js'
import doctorRoute from './routes/doctor.js'
import reviewRoute from './routes/review.js'
import bookingRoute from './routes/booking.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

const corsOptions = {
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.get('/',(req, res) =>{
    res.send('Api is Working')
})

mongoose.set('strictQuery', false)
const connectDB = async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log('MongoDB database is connected')
    }catch(err){
        console.log('MongoDB database is not connected')
    }
}
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth', authRoute); //domain/api/v1/auth
app.use('/api/v1/users', userRoute); 
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use('/api/v1/bookings', bookingRoute);


app.listen(port,()=>{
    connectDB();
    console.log('server is running');
})