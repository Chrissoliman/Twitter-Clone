import mongoose from "mongoose";

const connectMongoDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB:', db.connection.host)

    } catch(error) {
        console.log('Error in connecting to MongoDB: ', error)
        process.exit(1)
    }
}

export default connectMongoDB