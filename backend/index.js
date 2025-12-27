import express from "express";


// dotenv configuration
import { configDotenv } from "dotenv";
configDotenv();


//database connection
import { connectDb } from "./src/configs/db.connect.js";
connectDb();


// redis connection
import './src/configs/redis.connect.js';


// make a express app
const app = express();


// middleware of express parsing
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// important security middlewares import path
import hpp from "hpp";
import helmet from "helmet";
import { xssSanitizeRequest } from "./src/middleware/xssSanitizeMiddleware.js";
import { sanitizeRequest } from "./src/middleware/sanitizeMiddleware.js";


// uses on security middlewares
app.use(hpp())
app.use(helmet())
app.use(xssSanitizeRequest)
app.use(sanitizeRequest)


// logging middleware
import morgan from "morgan";
app.use(morgan("combined"));


export { app}