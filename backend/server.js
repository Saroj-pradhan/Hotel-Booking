import dotenv from "dotenv";
dotenv.config(); 

import express from "express";
import connectDB from "./src/config/db.js";

const app = express();
const port = 3000;

connectDB();
app.get("/" , (req , res)=>{
res.send("i am active")
})
app.listen(process.env.PORT,()=>{
    console.log(`server running on ${port}`)
})