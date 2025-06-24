import mongoose from "mongoose";
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB);
    console.log("MongoDB connected successfullly");
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
export default connectDb;
