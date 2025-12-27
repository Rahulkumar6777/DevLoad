import express from "express";


// dotenv configuration
import { configDotenv } from "dotenv";
configDotenv();


//database connection
import { connectDb } from "./src/configs/db.connect";
connectDb();


const app = express();


export { app}