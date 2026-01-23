import mongoose from "mongoose"

export const connectDb = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB connection made succesfully. Host: ", conn.connection.host)
    }
    catch (error) {
        console.log("Error while connecting to database: ", error)
    }
}