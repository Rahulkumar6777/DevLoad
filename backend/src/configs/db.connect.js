import mongoose from "mongoose";

export const connectDb = async ()=> {
    try {
        await mongoose.connect(`${process.env.NODE_ENV == 'production' ? process.env.MONGO_PRODUCTION_URI : process.env.MONGO_LOCALLY_URI}` , {
            authSource: 'admin'
        });
        console.log("database connected");
    } catch (error) {
        console.log("error while connect database" , error);
        process.exit(1);
    }
}