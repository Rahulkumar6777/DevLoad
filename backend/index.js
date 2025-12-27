import express from "express";


// dotenv configuration
import { configDotenv } from "dotenv";
configDotenv();


//database connection
import { connectDb } from "./src/configs/db.connect";
connectDb();


// redis connection
import './src/configs/redis.connect.js';


// middleware of express parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));


const app = express();


export { app}