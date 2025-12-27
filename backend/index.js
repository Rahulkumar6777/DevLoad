import express from "express";


// dotenv configuration
import { configDotenv } from "dotenv";
configDotenv();


const app = express();


export { app}