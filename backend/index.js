import express from "express";
import http from "http";
import { Server} from "socket.io";


// dotenv configuration
import { configDotenv } from "dotenv";
configDotenv();


//database connection
import { connectDb } from "./src/configs/db.connect.js";
await connectDb();


// redis connection
import './src/configs/redis.connect.js';


// make a express app
const app = express();


// cors middleware
import cors from "cors";
import { corsOptions } from "./src/utils/corsoption.utils.js";
app.use(cors(corsOptions));


// make server for socket.io
const server = http.createServer(app);
const io = new Server(server , {
    cors: corsOptions 
})


// connection on socket
io.on("connection" , (socket) => {
    console.log("user connected")

    socket.on("disconnect" , async () => {
        console.log('user disconnected')
    })
})


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


// cookie parser middleware
import cookieParser from "cookie-parser";
app.use(cookieParser());


// compression middleware
import compression from "compression";
app.use(compression());


// client monitoring middleware
import UAParser from 'ua-parser-js';
export function monitoringMiddleware(req, res, next) {
  try {
    const parser = new UAParser(req.headers['user-agent']);
    const clientInfo = parser.getResult();

    // Attach only client info
    req.monitoring = {
      client: clientInfo
    };

    next();
  } catch (err) {
    next(err);
  }
}


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});


export { app , server , io}