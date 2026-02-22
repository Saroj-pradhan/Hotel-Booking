import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import connectDB from "./src/config/db.js";

import userRoutes from "./src/routes/userRoutes.js"
import hotelsRoutes from './src/routes/hotelsRoutes.js'
const app = express();
app.use(express.json()) 

connectDB();
app.use('/api/auth',userRoutes);
app.use("/api/hotels",hotelsRoutes)


app.get("/" , (req , res)=>{
res.send("i am active")
})
app.listen(process.env.PORT,()=>{
    console.log(`server running on ${process.env.PORT}`)
}) 